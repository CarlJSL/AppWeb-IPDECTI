import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/user/users.service';
import { detectChanges } from 'src/common/helpers/helper.detectChanges';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const data = createUserProfileDto;

    const id = data.userId;
    const user = await this.usersService.findOneId(id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const existingProfile = await this.findOneComprobar(id, data.email);
    if (existingProfile) {
      throw new BadRequestException(
        'El usuario ya tiene un perfil o el email ya está en uso',
      );
    }

    const userProfile = await this.prisma.userProfile.create({
      data: {
        user: {
          connect: {
            id: id,
          },
        },
        names: data.names,
        lastNames: data.lastNames,
        address: data.address,
        phone: data.phone,
        dni: data.dni,
        emailPersonal: data.email,
        birthdate: data.birthdate,
      },
    });
    return {
      data: userProfile,
      message: 'Perfil creado exitosamente',
      status: HttpStatus.CREATED,
    };
  }

  findAll() {
    return `This action returns all userProfile`;
  }

  async findOne(id: string) {
    return await this.prisma.userProfile.findUnique({
      where: {
        userId: id,
      },
    });
  }

  private async findOneComprobar(id: string, email: string) {
    return await this.prisma.userProfile.findFirst({
      where: {
        OR: [{ userId: id }, { emailPersonal: email }],
      },
    });
  }

  async update(
    id: string,
    updateUserProfileDto: Partial<UpdateUserProfileDto>,
  ) {
    const existingProfile = await this.prisma.userProfile.findUnique({
      where: { id: id },
    });

    if (!existingProfile) throw new NotFoundException('Perfil no encontrado');

    if (!updateUserProfileDto || Object.keys(updateUserProfileDto).length === 0)
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar',
      );

    const profileChanges = detectChanges(existingProfile, updateUserProfileDto);

    if (Object.keys(profileChanges).length === 0)
      throw new BadRequestException(
        'No se ha proporcionado datos para actualizar',
      );

    await this.prisma.userProfile.update({
      where: { id },
      data: profileChanges,
    });

    return {
      message: 'Perfil actualizado correctamente',
      status: HttpStatus.OK,
    };
  }
}

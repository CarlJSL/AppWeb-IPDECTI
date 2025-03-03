import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/user/users.service';

@Injectable()
export class UserProfileService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(createUserProfileDto: CreateUserProfileDto) {
    const data = createUserProfileDto;

    const id = data.userId;
    const user = await this.usersService.finOneId(id);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    const existingProfile = await this.findOne(id);
    if (existingProfile) {
      throw new BadRequestException('El usuario ya tiene un perfil');
    }

    const userProfile = await this.prisma.userProfile.create({
      data: {
        user: {
          connect: {
            id: id,
          },
        },
        Names: data.names,
        LastNames: data.lastNames,
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
      where: { userId: id },
    });
  }

  update(id: number, updateUserProfileDto: UpdateUserProfileDto) {
    return `This action updates a #${id} userProfile`;
  }
}

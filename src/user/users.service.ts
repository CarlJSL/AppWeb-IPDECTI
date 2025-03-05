import {
  BadRequestException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserPaginationDto } from './dto/user-paginacion.dto';
import { _ } from 'lodash';
import {
  UserStatusEnum,
  UserStatusList,
} from '../common/enums/user-status.enum';
import { paginate } from 'src/common/helpers/helper.pagination';
import { detectChanges } from 'src/common/helpers/helper.detectChanges';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('ServiceUsers');

  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto, createdBy: string) {
    const data = createUserDto;
    const existingUser = await this.findOneByEmail(data.email);

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        createdBy, // Usuario que creó el registro
        updatedBy: createdBy,
      },
    });
    return { message: 'Usuario registrado exitosamente' };
  }

  async findAll(userPaginationDto: UserPaginationDto) {
    return await paginate({
      prisma: this.prisma,
      model: this.prisma.user,
      page: userPaginationDto.page,
      limit: userPaginationDto.limit,
      where: { status: userPaginationDto.status },
    });
  }

  async findOneId(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: id },
      include: { userProfile: true },
    });
    return user;
  }

  async findOneByEmailData(email: string) {
    const userdata = await this.prisma.user.findUnique({
      where: { email: email },
      include: { userProfile: true },
    });

    if (!userdata) {
      throw new NotFoundException(`Usuario con " ${email} " no encontrado`);
      status: HttpStatus.NOT_FOUND;
    }

    return userdata;
  }

  async findOneByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    if (!updateUserDto || Object.keys(updateUserDto).length === 0) {
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar',
      );
    }

    const { name, role } = updateUserDto;

    // Obtener el usuario existente con su perfil
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }
    // Detectar cambios en los datos
    const userChanges = detectChanges(existingUser, { name, role });

    if (Object.keys(userChanges).length === 0) {
      throw new BadRequestException(
        'No se detectaron cambios en los datos proporcionados',
      );
    }

    //  Transacción para asegurar consistencia
    await this.prisma.$transaction(async (prisma) => {
      // Actualizar usuario si hay cambios
      if (Object.keys(userChanges).length > 0) {
        await prisma.user.update({
          where: { id },
          data: userChanges,
        });
      }

      // Actualizar perfil si hay cambios
    });

    return { message: 'Usuario actualizado correctamente' };
  }

  async remove(deleteUserDto: string) {
    const emailChangeState = deleteUserDto;
    const user = await this.findOneByEmail(emailChangeState);
    if (!user) {
      throw new BadRequestException('Usuario no encontrado');
    }

    if (user.status === UserStatusEnum.INACTIVE) {
      throw new BadRequestException('El usuario ya está inactivo');
    }
    const userDelete = await this.prisma.user.update({
      where: { email: emailChangeState },
      data: { status: UserStatusEnum.INACTIVE },
    });

    const { id: _, email, name, role } = userDelete;
    const selectedData = { email, name, role };

    return {
      message: 'Usuario eliminado correctamente',
      data: selectedData,
      state: HttpStatus.OK,
    };
  }

  async createaAuto(createUserDto: CreateUserDto) {
    const data = createUserDto;
    const createdBy = 'SYSTEM';
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role,
        createdBy: createdBy, // Usuario que creó el registro
        updatedBy: createdBy,
        status: UserStatusEnum.SUSPENDED,
      },
    });

    return user;
  }

  async findUserProfile(id: string) {
    return await this.prisma.userProfile.findUnique({
      where: { userId: id },
    });
  }
}

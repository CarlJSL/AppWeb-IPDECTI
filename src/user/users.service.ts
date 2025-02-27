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
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderPaginationDto } from './dto/user-paginacion.dto';
import { _ } from 'lodash';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UserStatusEnum, UserStatusList } from './enum/user-status.enum';

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

  async findAll(userPaginationDto: OrderPaginationDto) {
    const statusUser = userPaginationDto.status;
    const currentPage = userPaginationDto.page;
    const limit = userPaginationDto.limit;

    const totalNumUser = await this.prisma.user.count({
      where: {
        status: statusUser,
      },
    });

    const lastPage = Math.ceil(totalNumUser / limit);

    if (currentPage > lastPage || currentPage < 1) {
      return {
        data: [],
        meta: {
          total: totalNumUser,
          page: currentPage,
          lastPage,
          message: 'No hay datos disponibles para esta página.',
        },
      };
    }

    return {
      data: await this.prisma.user.findMany({
        skip: (currentPage - 1) * limit,
        take: limit,
        where: {
          status: statusUser,
        },
      }),
      meta: {
        total: totalNumUser,
        page: currentPage,
        lastPage,
      },
    };
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async update(id: string, updateUserDto: Partial<UpdateUserDto>) {
    if (_.isEmpty(updateUserDto)) {
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar',
      );
    }

    const { name, role, userProfile } = updateUserDto;

    // Obtener el usuario existente con su perfil
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Detectar cambios en los campos del usuario
    const userChanges = _.pickBy(
      { name, role },
      (value, key) => !_.isEqual(value, existingUser[key]),
    );

    // Detectar cambios en el perfil del usuario
    const profileChanges = userProfile
      ? _.pickBy(
          userProfile,
          (value, key) => !_.isEqual(value, existingUser.userProfile?.[key]),
        )
      : {};

    // Si no hay cambios, lanzar una excepción
    if (_.isEmpty(userChanges) && _.isEmpty(profileChanges)) {
      throw new BadRequestException(
        'No se detectaron cambios en los datos proporcionados',
      );
    }

    // Actualizar el usuario si hay cambios
    if (!_.isEmpty(userChanges)) {
      await this.prisma.user.update({
        where: { id },
        data: userChanges,
      });
    }

    // Actualizar o crear el perfil del usuario si hay cambios
    if (!_.isEmpty(profileChanges)) {
      await this.prisma.userProfile.upsert({
        where: { userId: id },
        update: profileChanges,
        create: {
          user: { connect: { id } },
          ...profileChanges,
        },
      });
    }

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
  
}

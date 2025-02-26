import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderPaginationDto } from './dto/user-paginacion.dto';

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

    const lastPage = Math.ceil( totalNumUser / limit);

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { name, role, userProfile } = updateUserDto;

    // Verificar si el usuario existe
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
      include: { userProfile: true },
    });

    if (!existingUser) {
      throw new NotFoundException('Usuario no encontrado');
    }

    // Construcción del objeto de actualización
    const userData: any = {};
    if (name) userData.name = name;
    if (role) userData.role = role;

    // Actualizar usuario si hay cambios
    if (Object.keys(userData).length > 0) {
      await this.prisma.user.update({
        where: { id },
        data: userData,
      });
    }

    await this.prisma.userProfile.upsert({
      where: { userId: id },
      update: { ...userProfile }, 
      create: { 
        user: { connect: { id } }, 
        ...userProfile
      },
    });
    return { message: 'Usuario actualizado correctamente' };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}

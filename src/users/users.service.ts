import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ServiceUsers');

  async onModuleInit() {
    this.$connect();
    this.logger.log('Database connected');
  }

  async create(createUserDto: CreateUserDto) {
    // Verificar si el email ya existe
    const data = createUserDto;
    const existingUser = await this.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new BadRequestException('El email ya está registrado');
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Crear el usuario con el rol seleccionado
    const user = await this.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role, // Se guarda el rol elegido
      },
    });

    return { message: 'Usuario registrado exitosamente', user };
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOneByEmail(email: string) {
    return await this.user.findUnique({
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

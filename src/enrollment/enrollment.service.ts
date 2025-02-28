import {
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/user/users.service';
import { Role } from 'src/enums/roles.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { stat } from 'fs';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const { email, dni, names, courseId } = createEnrollmentDto;

    const emailBase = email.split('@')[0];
    const institutionalEmail = `${emailBase}@ipdecti.com`;

    let user = await this.userService.findOneByEmail(institutionalEmail);

    if (!user) {
      const createUser: CreateUserDto = {
        name: names,
        email: institutionalEmail,
        password: dni,
        role: Role.POSTULANT,
      };

      ///Logica para añadir userProfile Despues de Haccer el modulo de UserProfile

      const newUser = await this.userService.createaAuto(createUser);
      user = newUser;
    }

    // Verificar si ya está inscrito en el curso
    const existingEnrollment = await this.prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        courseId: courseId,
      },
    });

    if (existingEnrollment) {
      throw new ConflictException('El usuario ya está inscrito en este curso');
    }

    // Crear matrícula
    const enrollment = await this.prisma.enrollment.create({
      data: {
        userId: user.id,
        courseId: courseId,
      }, // crear pdf de la matricula
    });

    return {
      data: enrollment,
      message: 'Matrícula registrada exitosamente',
      state: HttpStatus.CREATED,
    };
  }

  findAll() {
    return `This action returns all enrollment`;
  }

  findOne(id: number) {
    return `This action returns a #${id} enrollment`;
  }

  update(id: number, updateEnrollmentDto: UpdateEnrollmentDto) {
    return `This action updates a #${id} enrollment`;
  }

  remove(id: number) {
    return `This action removes a #${id} enrollment`;
  }
}

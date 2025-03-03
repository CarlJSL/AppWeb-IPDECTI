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
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { last } from 'rxjs';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly userProfileService: UserProfileService,
  ) {}

  async create(createEnrollmentDto: CreateEnrollmentDto) {
    const {
      email,
      dni,
      names,
      courseId,
      lastNames,
      phone,
      address,
      birthdate,
    } = createEnrollmentDto;

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

      const newUser = await this.userService.createaAuto(createUser);

      const dtoCreateUserProfile = {
        userId: newUser.id,
        names: names,
        lastNames: lastNames,
        dni: dni,
        email: email,
        phone: phone,
        address: address,
        birthdate: birthdate,
      };

      const userProfile =
        await this.userProfileService.create(dtoCreateUserProfile);

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

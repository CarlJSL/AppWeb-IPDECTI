import {
  BadRequestException,
  ConflictException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UsersService } from 'src/user/users.service';
import { Role } from 'src/common/enums/roles.enum';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserProfileService } from 'src/user-profile/user-profile.service';
import { last } from 'rxjs';
import { CourseService } from 'src/course/course.service';
import { EnrollmentPaginationDto } from './dto/pagination-enrollment.dto';
import { paginate } from 'src/common/helpers/helper.pagination';
import { plainToInstance } from 'class-transformer';
import { EnrollmentResponseDto } from './dto/response-enrollment.dto';
import { detectChanges } from 'src/common/helpers/helper.detectChanges';

@Injectable()
export class EnrollmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
    private readonly userProfileService: UserProfileService,
    private readonly courseService: CourseService,
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
    const course = await this.courseService.findOneStatusActive(courseId);

    if (!course) {
      throw new NotFoundException('El curso no existe');
    }

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
      include: {
        user: {
          select: {
            userProfile: {
              select: {
                names: true,
                lastNames: true,
                dni: true,
              },
            },
          },
        },
        course: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      data: plainToInstance(EnrollmentResponseDto, enrollment, {
        excludeExtraneousValues: true,
      }),
      message: 'Matrícula registrada exitosamente',
      state: HttpStatus.CREATED,
    };
  }

  async findAll(enrollmentPaginationDto: EnrollmentPaginationDto) {
    return await paginate({
      prisma: this.prisma,
      model: this.prisma.enrollment,
      page: enrollmentPaginationDto.page,
      limit: enrollmentPaginationDto.limit,
      where: { status: enrollmentPaginationDto.status },
      select: {
        id: true,
        status: true,
        user: {
          select: {
            email: true,
            userProfile: {
              select: {
                names: true,
                lastNames: true,
                dni: true,
              },
            },
          },
        },
        course: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return `This action returns a #${id} enrollment`;
  }

  async update(id: string, updateEnrollmentDto: Partial<UpdateEnrollmentDto>) {
    if (!updateEnrollmentDto || Object.keys(updateEnrollmentDto).length === 0) {
      throw new BadRequestException(
        'Debe proporcional al menos un campo a actualizar',
      );
    }

    const { courseId } = updateEnrollmentDto;

    const course = await this.courseService.findOneStatusActive(courseId);

    if (!course) {
      throw new NotFoundException('El curso no existe');
    }

    const existingEnrollment = await this.prisma.enrollment.findUnique({
      where: { id: id },
    });

    if (!existingEnrollment) {
      throw new NotFoundException('La matrícula no existe');
    }

    const courseChanges = detectChanges(
      existingEnrollment,
      updateEnrollmentDto,
    );

    if (Object.keys(courseChanges).length === 0) {
      throw new BadRequestException(
        'No se detectarion cambios en los datos proporcionados',
      );
    }

    const enrollmentUpdate = await this.prisma.enrollment.update({
      where: { id },
      data: {
        courseId: courseId,
      },
      include: {
        user: {
          select: {
            userProfile: true,
          },
        },
        course: true,
      },
    });

    return {
      data: plainToInstance(EnrollmentResponseDto, enrollmentUpdate, {
        excludeExtraneousValues: true,
      }),
      message: 'Matrícula actualizada exitosamente',
      state: HttpStatus.OK,
    };
  }

  remove(id: string) {
    return `This action removes a #${id} enrollment`;
  }
}

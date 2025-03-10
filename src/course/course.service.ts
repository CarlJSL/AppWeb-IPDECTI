import {
  BadRequestException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role } from 'src/common/enums/roles.enum';
import { UsersService } from 'src/user/users.service';
import { CoursePaginationDto } from './dto/paginacion-course';
import { paginate } from 'src/common/helpers/helper.pagination';
import { detectChanges } from 'src/common/helpers/helper.detectChanges';
import { plainToInstance } from 'class-transformer';
import { CourseResponseDto } from './dto/response-course.dto';

@Injectable()
export class CourseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  async create(createCourseDto: CreateCourseDto) {
    const { name, teacherId, durationMonths, academicEventId } =
      createCourseDto;

    await this.validateTeacherExists(teacherId);

    await this.validateAcademicEventExists(academicEventId);

    const course = await this.prisma.course.create({
      data: {
        name,
        teacherId,
        durationMonths: durationMonths,
        academicEventId,
      },
      include: {
        teacher: {
          select: {
            userProfile: {
              select: {
                names: true,
                lastNames: true,
              },
            },
          },
        },
        academicEvent: {
          select: {
            name: true,
          },
        },
      },
    });

    return {
      data: plainToInstance(CourseResponseDto, course, {
        excludeExtraneousValues: true,
      }),
      message: 'Curso creado exitosamente',
      status: HttpStatus.CREATED,
    };
  }

  private async validateTeacherExists(teacherId: string) {
    const teacher = await this.userService.findOneId(teacherId);
    if (teacher.role !== Role.TEACHER) {
      throw new NotFoundException('El profesor no existe');
    }
  }

  private async validateAcademicEventExists(academicEventId: string) {
    const event = await this.prisma.academicEvent.findUnique({
      where: { id: academicEventId },
    });
    if (!event) {
      throw new NotFoundException('El evento académico no existe');
    }
  }

  async findAll(coursePaginationDto: CoursePaginationDto) {
    return await paginate({
      prisma: this.prisma,
      model: this.prisma.course,
      page: coursePaginationDto.page,
      limit: coursePaginationDto.limit,
      where: { status: coursePaginationDto.status },
      select: {
        id: true,
        name: true,
        durationMonths: true,

        teacher: {
          select: {
            userProfile: {
              select: {
                names: true,
                lastNames: true,
              },
            },
          },
        },
        academicEvent: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async findOneStatusActive(id: string) {
    const user = await this.prisma.course.findUnique({
      where: { id: id, status: 'ACTIVE' },
      include: {
        teacher: {
          select: {
            userProfile: {
              select: {
                names: true,
                lastNames: true,
              },
            },
          },
        },
        academicEvent: {
          select: {
            name: true,
          },
        },
      },
    });
    return plainToInstance(CourseResponseDto, user, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, updateCourseDto: Partial<UpdateCourseDto>) {
    if (!updateCourseDto || Object.keys(updateCourseDto).length === 0) {
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar',
      );
    }

    const { teacherId, academicEventId } = updateCourseDto;

    if (teacherId) await this.validateTeacherExists(teacherId);
    if (academicEventId)
      await this.validateAcademicEventExists(academicEventId);

    const existingCourse = await this.prisma.course.findUnique({
      where: { id },
    });

    if (!existingCourse) throw new NotFoundException('Curso no encontrado');

    // Usar el helper detectChanges
    const courseChanges = detectChanges(existingCourse, updateCourseDto);

    if (Object.keys(courseChanges).length === 0) {
      throw new BadRequestException(
        'No se detectaron cambios en los datos proporcionados',
      );
    }

    const userUpdate = await this.prisma.course.update({
      where: { id },
      data: courseChanges,
      include: {
        teacher: {
          select: {
            userProfile: true,
          },
        },
        academicEvent: true,
      },
    });

    return {
      data: plainToInstance(CourseResponseDto, userUpdate, {
        excludeExtraneousValues: true,
      }),
      message: 'Curso actualizado correctamente',
      status: HttpStatus.OK,
    };
  }

  async remove(id: string) {
    const courseNotActive = await this.prisma.course.findFirst({
      where: { id },
    });
    if (!courseNotActive) throw new BadRequestException('Curso no encontrado');
    if (courseNotActive.status === 'INACTIVE')
      throw new BadRequestException('El curso ya está inactivo');

    const deleteCourse = await this.prisma.course.update({
      where: { id },
      data: { status: 'INACTIVE' },
      include:{
        teacher: {
          select: {
            userProfile: true,
          },
        },
        academicEvent: true,
      }
        
      
    });

    return {
      data: plainToInstance(CourseResponseDto, deleteCourse, {
        excludeExtraneousValues: true,
      }),
      message: 'Curso eliminado correctamente',
      status: HttpStatus.OK,
    };
  }
}

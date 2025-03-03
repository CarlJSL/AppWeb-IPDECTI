import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { Role } from 'src/common/enums/roles.enum';
import { UsersService } from 'src/user/users.service';
import { CoursePaginationDto } from './dto/paginacion-course';
import { paginate } from 'src/common/helpers/helper.pagination';

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
    });

    return {
      data: course,
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
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} course`;
  }

  update(id: number, updateCourseDto: UpdateCourseDto) {
    return `This action updates a #${id} course`;
  }

  remove(id: number) {
    return `This action removes a #${id} course`;
  }
}

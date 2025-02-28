import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Role } from 'src/enums/roles.enum';



@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}

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
      message: 'Curso creado exitosamente',
      data: course,
      state: HttpStatus.CREATED,
    };
  }

  private async validateTeacherExists(teacherId: string) {
    const teacher = await this.prisma.user.findUnique({
      where: { id: teacherId, 
        role: Role.TEACHER
      },
    });
    if (!teacher) {
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

  findAll() {
    return `This action returns all course`;
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

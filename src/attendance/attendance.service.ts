import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RegisterAttendanceDto,
  UpdateAttendanceDto,
} from './dto/attendance.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CourseService } from 'src/course/course.service';
import { EnrollmentService } from 'src/enrollment/enrollment.service';

@Injectable()
export class AttendanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseService: CourseService,
    private readonly enrollmentService: EnrollmentService,
  ) {}

  // Obtener cursos asignados a un profesor
  async getCoursesByTeacher(teacherId: string) {
    // Obtener los cursos
    const courses = await this.courseService.getCoursesByTeacher(teacherId);
    // Validar si el profesor tiene cursos asignados
    if (!courses.length) {
      throw new NotFoundException(
        `No se encontraron cursos para el profesor con ID ${teacherId}`,
      );
    }

    return courses;
  }

  // Obtener estudiantes inscritos en un curso
  async getStudentsByCourse(courseId: string) {
    // Obtener los estudiantes inscritos en el curso
    const enrollments = await this.enrollmentService.getStudentsByCourse(
      courseId,
    );
    // Validar si hay estudiantes inscritos en el curso
    if (!enrollments.length) {
      throw new NotFoundException(
        `No se encontraron estudiantes inscritos en el curso con ID ${courseId}`,
      );
    }

    return enrollments;
  }

  // Registrar asistencia
  async registerAttendance(dto: RegisterAttendanceDto) {
    const { courseId, date, attendances } = dto;

    // Verificar si el curso existe
    const course = await this.courseService.findOneStatusActive(courseId);

    // Guardar la asistencia en la base de datos
    return this.prisma.attendance.createMany({
      data: attendances.map((attendance) => ({
        studentId: attendance.studentId,
        courseId,
        date: new Date(date),
        status: attendance.status, // Usa el enum AttendanceStatus
        comments: attendance.comments ?? null,
      })),
    });
  }

  // Obtener historial de asistencia de un curso
  async getAttendanceByCourse(courseId: string) {

    await this.courseService.findOneStatusActive(courseId);

    return this.prisma.attendance.findMany({
      where: { courseId },
      include: { student: true },
    });
  }

  // Modificar asistencia
  async updateAttendance(attendanceId: string, dto: UpdateAttendanceDto) {
    const { status, comments } = dto;

    // Verificar si la asistencia existe
    const attendance = await this.prisma.attendance.findUnique({
      where: { id: attendanceId },
    });
    if (!attendance) {
      throw new NotFoundException(
        `Asistencia con ID ${attendanceId} no encontrada`,
      );
    }

    return this.prisma.attendance.update({
      where: { id: attendanceId },
      data: {
        status, // Actualiza el estado de asistencia
        comments: comments ?? null, // Permite comentarios opcionales
      },
    });
  }
}

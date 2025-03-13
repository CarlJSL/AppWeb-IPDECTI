import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import {
  RegisterAttendanceDto,
  UpdateAttendanceDto,
} from './dto/attendance.dto';

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get('/teacher/:teacherId/courses')
  getCoursesByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string) {
    return this.attendanceService.getCoursesByTeacher(teacherId);
  }

  @Get('/course/:courseId/students')
  getStudentsByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.attendanceService.getStudentsByCourse(courseId);
  }

  @Post('/')
  registerAttendance(@Body() dto: RegisterAttendanceDto) {
    return this.attendanceService.registerAttendance(dto);
  }

  @Get('/course/:courseId')
  getAttendanceByCourse(@Param('courseId', ParseUUIDPipe) courseId: string) {
    return this.attendanceService.getAttendanceByCourse(courseId);
  }

  @Patch('/:attendanceId')
  updateAttendance(
    @Param('attendanceId', ParseUUIDPipe) attendanceId: string,
    @Body() dto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.updateAttendance(attendanceId, dto);
  }
}

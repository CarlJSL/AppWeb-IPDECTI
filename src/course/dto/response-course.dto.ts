import { Expose, Type } from 'class-transformer';

class UserProfileResponseDto {
  @Expose()
  names: string;

  @Expose()
  lastNames: string;
}

class TeacherResponseDto {
  @Expose()
  @Type(() => UserProfileResponseDto)
  userProfile: UserProfileResponseDto | null;
}

class AcademicEventResponseDto {
  @Expose()
  name: string;
}

export class CourseResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  durationMonths: number;

  @Expose()
  status: string;

  @Expose()
  @Type(() => TeacherResponseDto)
  teacher: TeacherResponseDto;

  @Expose()
  @Type(() => AcademicEventResponseDto)
  academicEvent: AcademicEventResponseDto;
}


import { Expose, Type } from 'class-transformer';

class UserProfileResponseDto {
  @Expose()
  names: string;

  @Expose()
  lastNames: string;

  @Expose()
  dni: string;
}

class UserResponseDto {
  @Expose()
  @Type(() => UserProfileResponseDto)
  userProfile: UserProfileResponseDto;
}

class CourseResponseDto {
  @Expose()
  name: string;
}

export class EnrollmentResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  @Type(() => UserResponseDto)
  user: UserResponseDto;

  @Expose()
  @Type(() => CourseResponseDto)
  course: CourseResponseDto;
}
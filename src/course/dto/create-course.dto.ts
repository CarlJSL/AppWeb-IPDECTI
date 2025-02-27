import { IsNotEmpty, IsString, IsUUID, IsInt, Min } from 'class-validator';

export class CreateCourseDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  durationMonths: number;

  @IsNotEmpty()
  @IsUUID()
  academicEventId: string;
}

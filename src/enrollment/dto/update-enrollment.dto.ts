import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentDto } from './create-enrollment.dto';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class UpdateEnrollmentDto {
  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}

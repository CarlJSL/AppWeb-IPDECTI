import { 
  IsUUID, 
  IsDateString, 
  IsArray, 
  ValidateNested, 
  IsEnum, 
  IsOptional, 
  IsString 
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '@prisma/client'; // Asegúrate de importar el enum correcto

class AttendanceEntryDto {
  @IsUUID()
  studentId: string;

  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}

export class RegisterAttendanceDto {
  @IsUUID()
  courseId: string;

  @IsUUID()
  markedById: string;

  @IsDateString()
  date: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttendanceEntryDto)
  attendances: AttendanceEntryDto[];
}

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  status: AttendanceStatus;

  @IsOptional()
  @IsString()
  comments?: string;
}

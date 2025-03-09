import { EnrollmentStatus } from '@prisma/client';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { EnrollmentStatusList } from 'src/common/enums/enrollment-status.enum';

export class EnrollmentPaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(EnrollmentStatusList, {
    message: `Valid status are ${EnrollmentStatusList}`,
  })
  status?: EnrollmentStatus;
}

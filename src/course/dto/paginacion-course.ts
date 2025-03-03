import { IsEnum, IsOptional } from 'class-validator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CourseStatus } from '@prisma/client';
import { CourseStatusList } from 'src/enums/course-status.enum';

export class CoursePaginationDto extends PaginationDto {
  @IsOptional()
  @IsEnum(CourseStatusList, {
    message: `Valid status are ${CourseStatusList}`,
  })
  status: CourseStatus;
}

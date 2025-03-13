import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from 'src/user/users.module';
import { UserProfileModule } from 'src/user-profile/user-profile.module';
import { CourseModule } from 'src/course/course.module';

@Module({
  imports: [PrismaModule, UsersModule, UserProfileModule, CourseModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
  exports: [EnrollmentService],
})
export class EnrollmentModule {}

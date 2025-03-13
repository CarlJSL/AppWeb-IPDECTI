import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { UserProfileModule } from './user-profile/user-profile.module';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    CourseModule,
    EnrollmentModule,
    UserProfileModule,
    AttendanceModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule, CourseModule, EnrollmentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

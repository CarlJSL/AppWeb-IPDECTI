import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './common/prisma/prisma.module';
import { CourseModule } from './course/course.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { UserProfileModule } from './user-profile/user-profile.module';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    PrismaModule,
    CourseModule,
    EnrollmentModule,
    UserProfileModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

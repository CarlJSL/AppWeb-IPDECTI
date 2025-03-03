import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports:[PrismaModule, UsersModule],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}

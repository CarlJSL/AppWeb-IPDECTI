import { Module } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import { EnrollmentController } from './enrollment.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}

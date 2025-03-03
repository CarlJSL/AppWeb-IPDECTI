import { Module } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { PrismaModule } from 'src/common/prisma/prisma.module';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [UserProfileController],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}

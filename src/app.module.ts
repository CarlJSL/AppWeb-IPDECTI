import { Module } from '@nestjs/common';
import { UsersModule } from './user/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [UsersModule, AuthModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

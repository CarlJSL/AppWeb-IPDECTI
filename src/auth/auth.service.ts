import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$connect();
  }

  constructor(private readonly usersService: UsersService) {
    super();
  }

  async login(LoginAuthDto: LoginDto) {
    const { email, password } = LoginAuthDto;

    try {
      const user = await this.usersService.findOneByEmail(email);

      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      return {
        email: user.email,
        message: 'Login successful',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid email or password');
    }
  }
  

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

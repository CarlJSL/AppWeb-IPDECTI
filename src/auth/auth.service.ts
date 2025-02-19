import {
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    this.$connect();
  }

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {
    super();
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    try {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }

      const payload = { email: user.email };

      const token = await this.jwtService.signAsync(payload);

      return {
        token: token,
        message: 'Login successful',
      };
    } catch (error) {
      throw new UnauthorizedException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Error Interno del Servidor',
      });
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

import {
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { PrismaClient, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { envs } from 'src/config/envs';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { VerifyTokenDto } from './dto/token.dto';

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
  async signJWT(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  async verifyToken(tokenDto: VerifyTokenDto) {
    try {
      const { sub, iat, exp, ...user } = this.jwtService.verify(tokenDto.token, {
        secret: envs.jwtSecret,
      });

      return {
        user: user,
        token: await this.signJWT(user),
      };
    } catch (error) {
      console.log(error);
      throw new UnauthorizedException({
        status: 401,
        message: 'Invalid token',
      });
    }
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

      const { password: __, ...rest } = user;

      const payload = { data: rest };

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
}

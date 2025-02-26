import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { UsersService } from 'src/user/users.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { Role } from './enums/role.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.validateUser(loginDto.email, loginDto.password);

      const interfacePayload: JwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role as Role,
      };
      const token = await this.jwtService.signAsync(interfacePayload);

      return { token, message: 'Login successful' };
    } catch (error) {
      throw new InternalServerErrorException('Error interno del servidor');
    }
  }
}

import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { OrderPaginationDto } from './dto/user-paginacion.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() createUserDto: CreateUserDto, @CurrentUser() user) {
    return this.usersService.create(createUserDto, user);
  }

  @Roles(Role.ADMIN)
  @Get(':status')
  findAll(
    @Query() paginationDto: PaginationDto,
    @Param() statusDto: OrderPaginationDto,
  ) {
    const orderPaginationDto = {
      ...paginationDto,
      status: statusDto.status,
    };

    return this.usersService.findAll(orderPaginationDto);
  }

  @Roles(Role.ADMIN, Role.TEACHER)
  @Get(':email')
  findOneByEmail(@Param('email') id: string) {
    return this.usersService.findOneByEmail(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}

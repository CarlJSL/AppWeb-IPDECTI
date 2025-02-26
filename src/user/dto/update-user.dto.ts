import { IsOptional, IsString, IsEnum, IsUUID, IsDate, IsPhoneNumber } from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  SecondName?: string;

  @IsOptional()
  @IsString()
  firstLastName?: string;

  @IsOptional()
  @IsString()
  secondLastName?: string;

  @IsOptional()
  @IsString()
  dni?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDate()
  birthdate?: Date;
}

export class UpdateUserDto {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
  
    @IsOptional()
    userProfile?: UpdateUserProfileDto; // Cambiar "profile" por "userProfile"
  }
  

import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

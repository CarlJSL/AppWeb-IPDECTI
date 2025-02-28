import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsPhoneNumber,
  IsDate,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateEnrollmentDto {
  @IsNotEmpty()
  @IsString()
  names: string;

  @IsNotEmpty()
  @IsString()
  lastNames: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8, { message: 'DNI debe tener exactamente 8 caracteres' })
  dni: string;

  @IsNotEmpty()
  @IsEmail({}, { message: 'Correo inválido' })
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber('PE', { message: 'Número de teléfono inválido' })
  phone: string;

  @IsNotEmpty()
  @Type(()=> Date)
  @IsDate({ message: 'Fecha de nacimiento inválida' })
  birthdate: Date;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsUUID()
  courseId: string;
}

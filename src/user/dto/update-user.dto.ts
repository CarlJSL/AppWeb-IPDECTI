import { IsOptional, IsString, IsEnum} from 'class-validator';
import { Role } from '@prisma/client';

export class UpdateUserDto  {
    @IsOptional()
    @IsString()
    name?: string;
  
    @IsOptional()
    @IsEnum(Role)
    role?: Role;
  
}
  

import { Exclude, Expose, Type } from 'class-transformer';

class UserProfileResponseDto {
  @Expose()
  names: string;

  @Expose()
  lastNames: string;

  @Expose()
  phone: string;
}

export class UserResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  email: string;

  @Expose()
  role: string;

  @Expose()
  status: string

  @Type(() => UserProfileResponseDto)
  @Expose()
  userProfile: UserProfileResponseDto;
}

import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class UpdateUserProfileDto extends PartialType(OmitType(CreateUserProfileDto, ['userId'] as const)) {
}

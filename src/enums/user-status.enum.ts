import { UserStatus } from "@prisma/client";

export const UserStatusList= [
    UserStatus.ACTIVE,
    UserStatus.INACTIVE,
    UserStatus.SUSPENDED
]

export enum UserStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    SUSPENDED = 'SUSPENDED',
}
  
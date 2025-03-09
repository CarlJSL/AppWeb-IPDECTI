import { CourseStatus } from "@prisma/client";

export const CourseStatusList= [
    CourseStatus.ACTIVE,
    CourseStatus.INACTIVE,
    CourseStatus.COMPLETED,
    CourseStatus.CANCELED
]

export enum UserStatusEnum {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELED = 'CANCELED'
}
  
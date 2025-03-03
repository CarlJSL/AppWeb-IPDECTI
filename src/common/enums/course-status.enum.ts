import { CourseStatus } from "@prisma/client";
import { Course } from "src/course/entities/course.entity";

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
  
import { EnrollmentStatus } from "@prisma/client";

export const EnrollmentStatusList= [
    EnrollmentStatus.ACTIVE,
    EnrollmentStatus.COMPLETED,
    EnrollmentStatus.PENDIENTE,
    EnrollmentStatus.VENCIDA
]

export enum EnrollmentStatusEnum {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    PENDIENTE = 'PENDIENTE',
    VENCIDA = 'VENCIDA'
}
  
export const EnrollmentStatusActiveList= [
    EnrollmentStatus.ACTIVE,
    EnrollmentStatus.COMPLETED,
    EnrollmentStatus.PENDIENTE,
]
  
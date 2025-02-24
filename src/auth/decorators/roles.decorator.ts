import { SetMetadata } from "@nestjs/common";
import { Role } from "@prisma/client";

export const ROLES_KEY = "roles"; // Clave para acceder a los metadatos

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);



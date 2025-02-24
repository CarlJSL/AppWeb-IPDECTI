import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true; // Si no hay roles definidos, permite el acceso
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user.data.role);

    if (!user || !user.data.role) {
      throw new ForbiddenException('No tienes permisos para acceder a esta ruta');
    }

    if (!requiredRoles.includes(user.data.role)) {
      throw new ForbiddenException('Acceso denegado. Rol no autorizado');
    }

    return true;
  }
}

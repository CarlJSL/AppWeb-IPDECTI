import { Role } from "../enums/role.enum";

export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;  
  }


  
  
export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    rol: Role;  
  }


  enum Role {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
  }
  
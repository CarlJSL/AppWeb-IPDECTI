export interface JwtPayload {
    id: string;
    name: string;
    email: string;
    role: Role;  
  }


  enum Role {
    ADMIN = "ADMIN",
    STUDENT = "STUDENT",
    TEACHER = "TEACHER",
  }
  
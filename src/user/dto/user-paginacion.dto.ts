import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common/dto/pagination.dto";
import { UserStatusList} from "../../common/enums/user-status.enum";
import { UserStatus } from "@prisma/client";

export class UserPaginationDto extends PaginationDto{
   @IsOptional()
   @IsEnum(UserStatusList,{
    message: `Valid status are ${UserStatusList}`
   })
   status: UserStatus; 
}
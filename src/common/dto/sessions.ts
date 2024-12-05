import { UserStatuses } from '@domainModels/User';
import { ApiProperty }  from '@nestjs/swagger';
import { RoleDto }      from './roles';

export class UserSessionDto {
    @ApiProperty()
    userId : number;

    @ApiProperty()
    email : string;

    @ApiProperty({ enum: UserStatuses })
    status : UserStatuses;

    @ApiProperty()
    createdAt : Date;

    constructor(args: IUserSessionDtoArgs) {
        this.userId = args.userId;
        this.email = args.email;
        this.status = args.status;
        this.createdAt = args.createdAt;
    }
}

interface IUserSessionDtoArgs {
    userId    : number;
    email     : string;
    status    : UserStatuses;
    createdAt : Date;
}

export class AdminSessionDto {
    @ApiProperty()
    adminId : number;

    @ApiProperty()
    email : string;

    @ApiProperty()
    createdAt : Date;

    @ApiProperty()
    updatedAt : Date;

    @ApiProperty({ type: () => RoleDto })
    role : RoleDto;

    constructor(args: IAdminSessionDtoArgs) {
        this.adminId = args.adminId;
        this.email = args.email;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.role = args.role;
    }
}

interface IAdminSessionDtoArgs {
    adminId   : number;
    email     : string;
    createdAt : Date;
    updatedAt : Date;
    role      : RoleDto;
}

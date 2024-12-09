import { ApiProperty } from '@nestjs/swagger';
import { RoleDto }     from './roles';

export class AdminDto {
    @ApiProperty()
    id : number;

    @ApiProperty()
    roleId : number;

    @ApiProperty()
    email : string;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty()
    createdAt : Date;

    @ApiProperty()
    updatedAt : Date;

    @ApiProperty({ type: () => RoleDto })
    role : RoleDto;

    constructor(args: IAdminDtoArgs) {
        this.id = args.id;
        this.roleId = args.roleId;
        this.email = args.email;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
        this.role = args.role;
    }
}

interface IAdminDtoArgs {
    id        : number;
    roleId    : number;
    email     : string;
    firstName : string;
    lastName  : string;
    createdAt : Date;
    updatedAt : Date;
    role      : RoleDto;
}

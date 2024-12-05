import { RolePermissions } from '@domainModels/Role';
import { ApiProperty }     from '@nestjs/swagger';

export class RoleDto {
    @ApiProperty()
    id : number;

    @ApiProperty()
    name : string;

    @ApiProperty({ enum: RolePermissions, isArray: true })
    permissions : RolePermissions[];

    @ApiProperty()
    createdAt : Date;

    @ApiProperty()
    updateAt : Date;

    constructor(args: IRoleDtoArgs) {
        this.id = args.id;
        this.name = args.name;
        this.permissions = args.permissions;
        this.createdAt = args.createdAt;
        this.updateAt = args.updateAt;
    }
}

interface IRoleDtoArgs {
    id          : number;
    name        : string;
    permissions : RolePermissions[];
    createdAt   : Date;
    updateAt    : Date;
}

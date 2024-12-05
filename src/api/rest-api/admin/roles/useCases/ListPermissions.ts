import { Injectable }      from '@nestjs/common';
import BaseUseCase         from '@common/BaseUseCase';
import { ApiProperty }     from '@nestjs/swagger';
import { RolePermissions } from '@domainModels/Role';
import { AdminSessionDto } from '@common/dto';

export class AdminRolePermissionListReturn {
    @ApiProperty({ enum: RolePermissions, isArray: true })
    permissions : RolePermissions[];
}

@Injectable()
export default class AdminRolePermissionList extends BaseUseCase<
    undefined,
    AdminSessionDto,
    AdminRolePermissionListReturn
> {
    protected async execute() {
        return {
            permissions : Object.values(RolePermissions)
        };
    }
}

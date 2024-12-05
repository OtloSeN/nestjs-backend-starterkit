import { Injectable }               from '@nestjs/common';
import BaseUseCase                  from '@common/BaseUseCase';
import Joi                          from 'joi';
import { ApiProperty }              from '@nestjs/swagger';
import { dumpRole }                 from '@common/dumps';
import Role, { RolePermissions }    from '@domainModels/Role';
import { AdminSessionDto, RoleDto } from '@common/dto';

export class AdminRoleCreateParams {
    @ApiProperty()
    name : string;

    @ApiProperty({ enum: RolePermissions, isArray: true })
    permissions : RolePermissions[];
}

export class AdminRoleCreateReturn extends RoleDto {}

@Injectable()
export default class AdminRoleCreate extends BaseUseCase<
    AdminRoleCreateParams,
    AdminSessionDto,
    AdminRoleCreateReturn
> {
    protected validationSchema = Joi.object<AdminRoleCreateParams>({
        name        : Joi.string().trim().min(1).required(),
        permissions : Joi.array().items(
            Joi.string().valid(...Object.values(RolePermissions)).required()
        ).min(1).unique().required()
    });

    protected async execute(data: AdminRoleCreateParams) {
        const role = await Role.createRole(data);

        return dumpRole(role);
    }
}

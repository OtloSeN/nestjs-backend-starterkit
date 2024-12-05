import { Injectable }                       from '@nestjs/common';
import BaseUseCase                          from '@common/BaseUseCase';
import Joi                                  from 'joi';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { dumpRole }                         from '@common/dumps';
import Role, { RolePermissions }            from '@domainModels/Role';
import { AdminSessionDto, RoleDto }         from '@common/dto';

export class AdminRoleUpdateBody {
    @ApiPropertyOptional()
    name? : string;

    @ApiPropertyOptional({ enum: RolePermissions, isArray: true })
    permissions? : RolePermissions[];
}

export class AdminRoleUpdateParams extends AdminRoleUpdateBody {
    @ApiProperty()
    id : number;
}

export class AdminRoleUpdateReturn extends RoleDto {}

@Injectable()
export default class AdminRoleUpdate extends BaseUseCase<
    AdminRoleUpdateParams,
    AdminSessionDto,
    AdminRoleUpdateReturn
> {
    protected validationSchema = Joi.object<AdminRoleUpdateParams>({
        id          : Joi.number().integer().positive().max(Role.MAX_SQL_INTEGER).required(),
        name        : Joi.string().trim().min(1),
        permissions : Joi.array().items(
            Joi.string().valid(...Object.values(RolePermissions)).required()
        ).min(1).unique()
    });

    protected async execute(data: AdminRoleUpdateParams) {
        const role = await Role.findOneOrThrow({
            where : { id: data.id }
        });

        await role.updateInstance(data);

        return dumpRole(role);
    }
}

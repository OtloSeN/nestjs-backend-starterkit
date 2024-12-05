import { Injectable }               from '@nestjs/common';
import BaseUseCase                  from '@common/BaseUseCase';
import Joi                          from 'joi';
import { ApiProperty }              from '@nestjs/swagger';
import { dumpRole }                 from '@common/dumps';
import Role                         from '@domainModels/Role';
import { AdminSessionDto, RoleDto } from '@common/dto';

export class AdminRoleShowParams {
    @ApiProperty()
    id : number;
}

export class AdminRoleShowReturn extends RoleDto {}

@Injectable()
export default class AdminRoleShow extends BaseUseCase<
    AdminRoleShowParams,
    AdminSessionDto,
    AdminRoleShowReturn
> {
    protected validationSchema = Joi.object<AdminRoleShowParams>({
        id : Joi.number().integer().positive().max(Role.MAX_SQL_INTEGER).required()
    });

    protected async execute({ id }: AdminRoleShowParams) {
        const role = await Role.findOneOrThrow({
            where : { id }
        });

        return dumpRole(role);
    }
}

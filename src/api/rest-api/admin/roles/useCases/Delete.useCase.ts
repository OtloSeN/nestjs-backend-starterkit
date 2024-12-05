import { Injectable }      from '@nestjs/common';
import BaseUseCase         from '@common/BaseUseCase';
import Joi                 from 'joi';
import { ApiProperty }     from '@nestjs/swagger';
import Role                from '@domainModels/Role';
import { AdminSessionDto } from '@common/dto';

export class AdminRoleDeleteParams {
    @ApiProperty()
    id : number;
}

export class AdminRoleDeleteReturn {
    @ApiProperty()
    id : number;
}

@Injectable()
export default class AdminRoleDelete extends BaseUseCase<
    AdminRoleDeleteParams,
    AdminSessionDto,
    AdminRoleDeleteReturn
> {
    protected validationSchema = Joi.object<AdminRoleDeleteParams>({
        id : Joi.number().integer().positive().max(Role.MAX_SQL_INTEGER).required()
    });

    protected async execute({ id }: AdminRoleDeleteParams) {
        const role = await Role.findOneOrThrow({
            where : { id }
        });

        await role.deleteInstance();

        return { id };
    }
}

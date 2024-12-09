import Joi                                  from 'joi';
import { Injectable }                       from '@nestjs/common';
import BaseUseCase                          from '@common/BaseUseCase';
import { AdminDto, AdminSessionDto }        from '@common/dto';
import Admin                                from '@domainModels/Admin';
import { dumpAdmin }                        from '@common/dumps';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import Role                                 from '@domainModels/Role';

export class AdminAdminUpdateBody {
    @ApiPropertyOptional()
    roleId : number;

    @ApiPropertyOptional()
    firstName : string;

    @ApiPropertyOptional()
    lastName : string;

    @ApiPropertyOptional()
    oldPassword : string;

    @ApiPropertyOptional()
    password : string;
}

export class AdminAdminUpdateParams extends AdminAdminUpdateBody {
    @ApiProperty()
    id : number;
}

export class AdminAdminUpdateReturn extends AdminDto {}

@Injectable()
export default class AdminAdminUpdate extends BaseUseCase<
    AdminAdminUpdateParams,
    AdminSessionDto,
    AdminAdminUpdateReturn
> {
    protected validationSchema = Joi.object<AdminAdminUpdateParams>({
        id        : Joi.number().integer().positive().max(Admin.MAX_SQL_INTEGER).required(),
        roleId    : Joi.number().integer().positive().max(Role.MAX_SQL_INTEGER),
        firstName : Joi.string().trim().min(1).max(255),
        lastName  : Joi.string().trim().min(1).max(255),
        password  : Joi.string().trim().min(Admin.MIN_PASSWORD_LENGTH)
    });

    protected async execute({ id, ...data }: AdminAdminUpdateParams) {
        const admin = await Admin.findOneOrFail({
            where : { id }
        });

        await admin.updateInstance(data);

        const result = await Admin.findOneOrFail({
            where     : { id },
            relations : {
                role : true
            }
        });

        return dumpAdmin(result);
    }
}

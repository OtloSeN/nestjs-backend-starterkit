import { Injectable }                from '@nestjs/common';
import BaseUseCase                   from '@common/BaseUseCase';
import Joi                           from 'joi';
import { ApiProperty }               from '@nestjs/swagger';
import Role                          from '@domainModels/Role';
import { AdminDto, AdminSessionDto } from '@common/dto';
import { dumpAdmin }                 from '@common/dumps';
import Admin                         from '@domainModels/Admin';

export class AdminAdminCreateParams {
    @ApiProperty()
    roleId : number;

    @ApiProperty()
    email : string;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty()
    password : string;
}

export class AdminAdminCreateReturn extends AdminDto {}

@Injectable()
export default class AdminAdminCreate extends BaseUseCase<
    AdminAdminCreateParams,
    AdminSessionDto,
    AdminAdminCreateReturn
> {
    protected validationSchema = Joi.object<AdminAdminCreateParams>({
        roleId    : Joi.number().integer().positive().max(Role.MAX_SQL_INTEGER).required(),
        email     : Joi.string().email().required(),
        firstName : Joi.string().trim().max(255).required(),
        lastName  : Joi.string().trim().max(255).required(),
        password  : Joi.string().trim().min(Admin.MIN_PASSWORD_LENGTH).required()
    });

    protected async execute(data: AdminAdminCreateParams) {
        const admin = await Admin.register(data);

        return dumpAdmin(admin);
    }
}

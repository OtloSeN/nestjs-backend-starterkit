import Joi                           from 'joi';
import { Injectable }                from '@nestjs/common';
import BaseUseCase                   from '@common/BaseUseCase';
import { AdminDto, AdminSessionDto } from '@common/dto';
import Admin                         from '@domainModels/Admin';
import { dumpAdmin }                 from '@common/dumps';
import { ApiPropertyOptional }       from '@nestjs/swagger';

export class AdminAdminUpdateMeParams {
    @ApiPropertyOptional()
    firstName : string;

    @ApiPropertyOptional()
    lastName : string;

    @ApiPropertyOptional()
    oldPassword : string;

    @ApiPropertyOptional()
    password : string;
}

export class AdminAdminUpdateMeReturn extends AdminDto {}

@Injectable()
export default class AdminAdminUpdateMe extends BaseUseCase<
    AdminAdminUpdateMeParams,
    AdminSessionDto,
    AdminAdminUpdateMeReturn
> {
    protected validationSchema = Joi.object<AdminAdminUpdateMeParams>({
        firstName   : Joi.string().trim().min(1).max(255),
        lastName    : Joi.string().trim().min(1).max(255),
        oldPassword : Joi.string(),
        password    : Joi.string().trim().min(Admin.MIN_PASSWORD_LENGTH)
    }).with('oldPassword', 'password');

    protected async execute(data: AdminAdminUpdateMeParams) {
        const admin = await  Admin.findOneOrFail({
            where : {
                id : this.sessionContext.adminId
            },
            relations : {
                role : true
            }
        });

        await admin.updateMe(data);

        return dumpAdmin(admin);
    }
}

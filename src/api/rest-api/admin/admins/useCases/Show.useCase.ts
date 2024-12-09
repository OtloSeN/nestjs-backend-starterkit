import { Injectable }                from '@nestjs/common';
import BaseUseCase                   from '@common/BaseUseCase';
import Joi                           from 'joi';
import { ApiProperty }               from '@nestjs/swagger';
import { AdminDto, AdminSessionDto } from '@common/dto';
import Admin                         from '@domainModels/Admin';
import { dumpAdmin }                 from '@common/dumps';

export class AdminAdminShowParams {
    @ApiProperty()
    id : number;
}

export class AdminAdminShowReturn extends AdminDto {}

@Injectable()
export default class AdminAdminShow extends BaseUseCase<
    AdminAdminShowParams,
    AdminSessionDto,
    AdminAdminShowReturn
> {
    protected validationSchema = Joi.object<AdminAdminShowParams>({
        id : Joi.number().integer().positive().max(Admin.MAX_SQL_INTEGER).required()
    });

    protected async execute({ id }: AdminAdminShowParams) {
        const admin = await Admin.findOneOrThrow({
            where     : { id },
            relations : {
                role : true
            }
        });

        return dumpAdmin(admin);
    }
}

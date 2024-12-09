import { Injectable }          from '@nestjs/common';
import BaseUseCase             from '@common/BaseUseCase';
import Joi                     from 'joi';
import { ApiProperty }         from '@nestjs/swagger';
import { AdminSessionDto }     from '@common/dto';
import Admin                   from '@domainModels/Admin';
import { BadRequestException } from '@common/exceptions';

export class AdminAdminDeleteParams {
    @ApiProperty()
    id : number;
}

export class AdminAdminDeleteReturn {
    @ApiProperty()
    id : number;
}

@Injectable()
export default class AdminAdminDelete extends BaseUseCase<
    AdminAdminDeleteParams,
    AdminSessionDto,
    AdminAdminDeleteReturn
> {
    protected validationSchema = Joi.object<AdminAdminDeleteParams>({
        id : Joi.number().integer().positive().max(Admin.MAX_SQL_INTEGER).required()
    });

    protected async execute({ id }: AdminAdminDeleteParams) {
        if (this.sessionContext.adminId === id) {
            throw new BadRequestException({ code: 'CANNOT_DELETE_YOURSELF' });
        }

        const admin = await Admin.findOneOrThrow({
            where     : { id },
            relations : {
                role : true
            }
        });

        await admin.deleteInstance();

        return { id };
    }
}

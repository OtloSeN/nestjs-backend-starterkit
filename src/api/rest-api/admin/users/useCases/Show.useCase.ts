import { Injectable }               from '@nestjs/common';
import BaseUseCase                  from '@common/BaseUseCase';
import Joi                          from 'joi';
import { ApiProperty }              from '@nestjs/swagger';
import { AdminSessionDto, UserDto } from '@common/dto';
import { dumpUser }                 from '@common/dumps';
import User                         from '@domainModels/User';

export class AdminUserShowParams {
    @ApiProperty()
    id : number;
}

export class AdminUserShowReturn extends UserDto {}

@Injectable()
export default class AdminUserShow extends BaseUseCase<
    AdminUserShowParams,
    AdminSessionDto,
    AdminUserShowReturn
> {
    protected validationSchema = Joi.object<AdminUserShowParams>({
        id : Joi.number().integer().positive().max(User.MAX_SQL_INTEGER).required()
    });

    protected async execute({ id }: AdminUserShowParams) {
        const user = await User.findOneOrThrow({
            where : { id }
        });

        return dumpUser(user);
    }
}

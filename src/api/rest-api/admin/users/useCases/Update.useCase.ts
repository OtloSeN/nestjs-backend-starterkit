import { Injectable }                       from '@nestjs/common';
import BaseUseCase                          from '@common/BaseUseCase';
import Joi                                  from 'joi';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { dumpUser }                         from '@common/dumps';
import { AdminSessionDto, UserDto }         from '@common/dto';
import User, { UserStatuses }               from '@domainModels/User';

export class AdminUserUpdateBody {
    @ApiPropertyOptional({ enum: UserStatuses })
    status? : UserStatuses;
}

export class AdminUserUpdateParams extends AdminUserUpdateBody {
    @ApiProperty()
    id : number;
}

export class AdminUserUpdateReturn extends UserDto {}

@Injectable()
export default class AdminUserUpdate extends BaseUseCase<
    AdminUserUpdateParams,
    AdminSessionDto,
    AdminUserUpdateReturn
> {
    protected validationSchema = Joi.object<AdminUserUpdateParams>({
        id     : Joi.number().integer().positive().max(User.MAX_SQL_INTEGER).required(),
        status : Joi.string().valid(...Object.values(UserStatuses))
    });

    protected async execute(data: AdminUserUpdateParams) {
        const user = await User.findOneOrThrow({
            where : { id: data.id }
        });

        await user.updateByAdmin(data);

        return dumpUser(user);
    }
}

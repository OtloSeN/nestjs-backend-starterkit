import { Injectable }                          from '@nestjs/common';
import BaseUseCase                             from '@common/BaseUseCase';
import User                                    from 'src/domain/models/User';
import Joi                                     from 'joi';
import { ApiPropertyOptional }                 from '@nestjs/swagger';
import { UserDto, UserSessionDto }             from '@common/dto';
import { ALLOWED_IMG_MIMETYPES, MAX_IMG_SIZE } from '@common/constants';
import { dumpUser }                            from '@common/dumps';

export class MainProfileUpdateParams {
    @ApiPropertyOptional()
    firstName : string;

    @ApiPropertyOptional()
    lastName : string;

    @ApiPropertyOptional({ type: 'string', format: 'binary' })
    avatar : Express.Multer.File;

    @ApiPropertyOptional()
    oldPassword : string;

    @ApiPropertyOptional()
    password : string;
}

export class MainProfileUpdateReturn extends UserDto {}

@Injectable()
export default class MainProfileUpdate extends BaseUseCase<
    MainProfileUpdateParams,
    UserSessionDto,
    MainProfileUpdateReturn
> {
    protected validationSchema = Joi.object<MainProfileUpdateParams>({
        firstName : Joi.string().trim().min(1).max(255),
        lastName  : Joi.string().trim().min(1).max(255),
        avatar    : Joi.object({
            originalname : Joi.string().required(),
            mimetype     : Joi.string().valid(...ALLOWED_IMG_MIMETYPES),
            path         : Joi.string().required(),
            size         : Joi.number().integer().positive().max(MAX_IMG_SIZE)
        }),
        oldPassword : Joi.string(),
        password    : Joi.string().trim().min(User.MIN_PASSWORD_LENGTH)
    }).with('oldPassword', 'password');

    protected async execute(data: MainProfileUpdateParams) {
        const user = await User.findOneOrFail({
            where : {
                id : this.sessionContext.userId
            }
        });

        await user.updateProfile(data);

        return dumpUser(user);
    }
}

import { Injectable }                          from '@nestjs/common';
import BaseUseCase                             from '@common/BaseUseCase';
import User                                    from 'src/domain/models/User';
import Joi                                     from 'joi';
import { ApiProperty }                         from '@nestjs/swagger';
import { UserDto }                             from '@common/dto';
import { ALLOWED_IMG_MIMETYPES, MAX_IMG_SIZE } from '@common/constants';
import { dumpUser }                            from '@common/dumps';

export class MainProfileCreateParams {
    @ApiProperty()
    email : string;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty({ type: 'string', format: 'binary' })
    avatar : Express.Multer.File;

    @ApiProperty()
    password : string;
}

export class MainProfileCreateReturn extends UserDto {}

@Injectable()
export default class MainProfileCreate extends BaseUseCase<
    MainProfileCreateParams,
    undefined,
    MainProfileCreateReturn
> {
    protected validationSchema = Joi.object<MainProfileCreateParams>({
        email     : Joi.string().email().required(),
        firstName : Joi.string().trim().max(255).required(),
        lastName  : Joi.string().trim().max(255).required(),
        avatar    : Joi.object({
            originalname : Joi.string().required(),
            mimetype     : Joi.string().valid(...ALLOWED_IMG_MIMETYPES).required(),
            path         : Joi.string().required(),
            size         : Joi.number().integer().positive().max(MAX_IMG_SIZE).required()
        }).required(),
        password : Joi.string().trim().min(User.MIN_PASSWORD_LENGTH).required()
    });

    protected async execute(data: MainProfileCreateParams) {
        const user = await User.register({ ...data });

        return dumpUser(user);
    }
}

import jwt                     from 'jsonwebtoken';
import { Inject, Injectable }  from '@nestjs/common';
import BaseUseCase             from '@common/BaseUseCase';
import User                    from 'src/domain/models/User';
import Joi                     from 'joi';
import { ApiProperty }         from '@nestjs/swagger';
import IAppConfig              from 'configs/interfaces/IAppConfig';
import { CONFIG_PROVIDER_KEY } from 'configs/appConfig';
import { dumpUserSession }     from '@common/dumps';

export class MainSessionCreateParams {
    @ApiProperty()
    email : string;

    @ApiProperty()
    password : string;
}

export class MainSessionCreateReturn {
    @ApiProperty()
    accessToken : string;
}

@Injectable()
export default class MainSessionCreate extends BaseUseCase<
    MainSessionCreateParams,
    undefined,
    MainSessionCreateReturn
> {
    constructor(
        @Inject(CONFIG_PROVIDER_KEY)
        private readonly appConfig: IAppConfig
    ) {
        super();
    }

    protected validationSchema = Joi.object<MainSessionCreateParams>({
        email    : Joi.string().email().required(),
        password : Joi.string().required()
    });

    protected async execute(data: MainSessionCreateParams) {
        const user = await User.authenticate(data);

        const accessToken = jwt.sign(
            { ...dumpUserSession(user) },
            this.appConfig.session.secret,
            {
                expiresIn : this.appConfig.session.maxAge
            }
        );

        return {
            accessToken
        };
    }
}

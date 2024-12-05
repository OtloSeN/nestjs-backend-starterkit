import jwt                     from 'jsonwebtoken';
import { Inject, Injectable }  from '@nestjs/common';
import BaseUseCase             from '@common/BaseUseCase';
import Joi                     from 'joi';
import { ApiProperty }         from '@nestjs/swagger';
import { BadRequestException } from '@common/exceptions';
import IAppConfig              from 'configs/interfaces/IAppConfig';
import { CONFIG_PROVIDER_KEY } from 'configs/appConfig';
import Admin                   from '@domainModels/Admin';
import { dumpAdminSession }    from '@common/dumps';

export class AdminSessionCreateParams {
    @ApiProperty()
    email : string;

    @ApiProperty()
    password : string;
}

export class AdminSessionCreateReturn {
    @ApiProperty()
    accessToken : string;
}

@Injectable()
export default class AdminSessionCreate extends BaseUseCase<
    AdminSessionCreateParams,
    undefined,
    AdminSessionCreateReturn
> {
    constructor(
        @Inject(CONFIG_PROVIDER_KEY)
        private readonly appConfig: IAppConfig
    ) {
        super();
    }

    protected validationSchema = Joi.object<AdminSessionCreateParams>({
        email    : Joi.string().email().required(),
        password : Joi.string().required()
    });

    protected async execute(data: AdminSessionCreateParams) {
        const admin = await Admin.findOne({
            where : {
                email : data.email
            }
        });

        if (!admin || !await admin.checkPassword(data.password)) {
            throw new BadRequestException({ code: 'EMAIL_OR_PASSWORD_WRONG' });
        }

        const accessToken = jwt.sign(
            { ...dumpAdminSession(admin) },
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

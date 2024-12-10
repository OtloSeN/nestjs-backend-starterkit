import { Inject, Injectable }        from '@nestjs/common';
import Joi                           from 'joi';
import BaseUseCase                   from '@common/BaseUseCase';
import { CONFIG_PROVIDER_KEY }       from 'configs/appConfig';
import jwt, { JsonWebTokenError }    from 'jsonwebtoken';
import IAppConfig                    from 'configs/interfaces/IAppConfig';
import Admin                         from '@domainModels/Admin';
import { AdminSessionDto }           from '@common/dto';
import { dumpAdminSession }          from '@common/dumps';
import { ForbiddenRequestException } from '@common/exceptions';

export interface IAdminSessionCheckParams {
    token : string
}

@Injectable()
export default class AdminSessionCheck extends BaseUseCase<
    IAdminSessionCheckParams,
    undefined,
    AdminSessionDto
> {
    constructor(
        @Inject(CONFIG_PROVIDER_KEY)
        private readonly appConfig: IAppConfig
    ) {
        super();
    }

    protected validationSchema = Joi.object<IAdminSessionCheckParams>({
        token : Joi.string().required()
    });

    protected async execute(data: IAdminSessionCheckParams) {
        let payload: AdminSessionDto;

        try {
            payload = jwt.verify(data.token, this.appConfig.session.secret) as AdminSessionDto;
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new ForbiddenRequestException({ code: 'WRONG_TOKEN' });
            }

            /* istanbul ignore next */
            throw error;
        }

        const admin = await Admin.findOneOrThrow({
            where : {
                id : payload.adminId
            },
            relations : {
                role : true
            }
        });

        return dumpAdminSession(admin);
    }
}

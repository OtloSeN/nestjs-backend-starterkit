import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import Joi                                        from 'joi';
import BaseUseCase                                from '@common/BaseUseCase';
import { CONFIG_PROVIDER_KEY }                    from 'configs/appConfig';
import jwt, { JsonWebTokenError }                 from 'jsonwebtoken';
import Admin                                      from 'src/domain/models/Admin';
import IAppConfig                                 from 'configs/interfaces/IAppConfig';
import { IAdminSessionContext }                   from '../sessionContext.decorator';

export interface IAdminSessionCheckParams {
    token : string
}

export interface IAdminSessionCheckReturn extends IAdminSessionContext {}

@Injectable()
export default class AdminSessionCheck extends BaseUseCase<
    IAdminSessionCheckParams,
    IAdminSessionContext,
    IAdminSessionCheckReturn
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
        let payload;

        try {
            payload = jwt.verify(data.token, this.appConfig.session.secret);
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new ForbiddenException();
            }
        }

        const user = await Admin.findOneOrThrow({
            where : { id: payload.id }
        });

        return {
            id    : user.id,
            email : user.email
        };
    }
}

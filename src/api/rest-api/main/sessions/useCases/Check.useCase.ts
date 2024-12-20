import { Inject, Injectable }        from '@nestjs/common';
import Joi                           from 'joi';
import BaseUseCase                   from '@common/BaseUseCase';
import { CONFIG_PROVIDER_KEY }       from 'configs/appConfig';
import jwt, { JsonWebTokenError }    from 'jsonwebtoken';
import User                          from 'src/domain/models/User';
import IAppConfig                    from 'configs/interfaces/IAppConfig';
import { UserSessionDto }            from '@common/dto';
import { dumpUserSession }           from '@common/dumps';
import { ForbiddenRequestException } from '@common/exceptions';

export interface IMainSessionCheckParams {
    token : string
}

@Injectable()
export default class MainSessionCheck extends BaseUseCase<
    IMainSessionCheckParams,
    undefined,
    UserSessionDto
> {
    constructor(
        @Inject(CONFIG_PROVIDER_KEY)
        private readonly appConfig: IAppConfig
    ) {
        super();
    }

    protected validationSchema = Joi.object<IMainSessionCheckParams>({
        token : Joi.string().required()
    });

    protected async execute(data: IMainSessionCheckParams) {
        let payload: UserSessionDto;

        try {
            payload = jwt.verify(data.token, this.appConfig.session.secret) as UserSessionDto;
        } catch (error) {
            if (error instanceof JsonWebTokenError) {
                throw new ForbiddenRequestException({ code: 'WRONG_TOKEN' });
            }

            /* istanbul ignore next */
            throw error;
        }

        const user = await User.findOneOrThrow({
            where : { id: payload.userId }
        });

        return dumpUserSession(user);
    }
}

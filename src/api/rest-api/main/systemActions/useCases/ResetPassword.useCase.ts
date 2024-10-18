import { Injectable }               from '@nestjs/common';
import Joi                          from 'joi';
import BaseUseCase                  from '@common/BaseUseCase';
import User                         from 'src/domain/models/User';
import { ApiProperty }              from '@nestjs/swagger';
import EmailSender, { EMAIL_TYPES } from 'lib/email/EmailSender';
import SystemAction                 from '@domainModels/SystemAction';

export class MainSystemActionPasswordResetParams {
    @ApiProperty()
    email : string;
}

@Injectable()
export default class MainSystemActionPasswordReset extends BaseUseCase<
    MainSystemActionPasswordResetParams,
    undefined,
    void
> {
    constructor(
        private readonly emailSender: EmailSender,
    ) {
        super();
    }

    protected validationSchema = Joi.object<MainSystemActionPasswordResetParams>({
        email : Joi.string().email().required()
    });

    protected async execute(data: MainSystemActionPasswordResetParams) {
        const user = await User.findOneOrThrow({
            where : {
                email : data.email
            }
        });

        const action = await SystemAction.createPasswordResetAction(user.id);

        await this.emailSender.sendMail(EMAIL_TYPES.PASSWORD_RESET, user.email, {
            actionId : action.id
        });
    }
}

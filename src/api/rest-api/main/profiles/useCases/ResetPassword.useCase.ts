import { Injectable }  from '@nestjs/common';
import BaseUseCase     from '@common/BaseUseCase';
import User            from 'src/domain/models/User';
import Joi             from 'joi';
import { ApiProperty } from '@nestjs/swagger';
import SystemAction    from '@domainModels/SystemAction';

export class MainProfileResetPasswordParams {
    @ApiProperty()
    actionId : string;

    @ApiProperty()
    password : string;
}

@Injectable()
export default class MainProfileResetPassword extends BaseUseCase<
    MainProfileResetPasswordParams,
    undefined,
    void
> {
    protected validationSchema = Joi.object<MainProfileResetPasswordParams>({
        actionId : Joi.string().uuid().required(),
        password : Joi.string().trim().min(User.MIN_PASSWORD_LENGTH).required()
    });

    protected async execute(data: MainProfileResetPasswordParams) {
        const action = await SystemAction.findOneOrThrow({
            where     : { id: data.actionId },
            relations : {
                user : true
            }
        });

        action.validate();

        await action.user.resetPassword(data.password);

        await action.remove();
    }
}

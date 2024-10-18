import { Module }                    from '@nestjs/common';
import MainSessionModule             from '../sessions/sessions.module';
import MainSystemActionsController   from './systemActions.controller';
import MainSystemActionShow          from './useCases/Show.useCase';
import MainSystemActionPasswordReset from './useCases/ResetPassword.useCase';

@Module({
    imports     : [ MainSessionModule ],
    controllers : [ MainSystemActionsController ],
    providers   : [
        MainSystemActionShow,
        MainSystemActionPasswordReset
    ]
})
export default class MainSystemActionsModule {}

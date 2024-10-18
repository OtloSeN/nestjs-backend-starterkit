import { Module }               from '@nestjs/common';
import { MulterModule }         from '@nestjs/platform-express';
import storage                  from 'configs/storage.config';
import MainSessionModule        from '../sessions/sessions.module';
import MainProfileController    from './profiles.controller';
import MainProfileCreate        from './useCases/Create.useCase';
import MainProfileShow          from './useCases/Show.useCase';
import MainProfileUpdate        from './useCases/Update.useCase';
import MainProfileDelete        from './useCases/Delete.useCase';
import MainProfileResetPassword from './useCases/ResetPassword.useCase';

@Module({
    imports : [
        MulterModule.register({ storage }),
        MainSessionModule
    ],
    controllers : [ MainProfileController ],
    providers   : [
        MainProfileCreate,
        MainProfileShow,
        MainProfileUpdate,
        MainProfileDelete,
        MainProfileResetPassword
    ]
})
export default class MainProfileModule {}

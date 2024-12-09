import { Module }           from '@nestjs/common';
import AdminSessionModule   from '../sessions/sessions.module';
import AdminAdminController from './admins.controller';
import AdminAdminCreate     from './useCases/Create.useCase';
import AdminAdminList       from './useCases/List.useCase';
import AdminAdminShowMe     from './useCases/ShowMe.useCase';
import AdminAdminShow       from './useCases/Show.useCase';
import AdminAdminUpdateMe   from './useCases/UpdateMe.useCase';
import AdminAdminUpdate     from './useCases/Update.useCase';
import AdminAdminDelete     from './useCases/Delete.useCase';

@Module({
    imports : [
        AdminSessionModule
    ],
    controllers : [ AdminAdminController ],
    providers   : [
        AdminAdminCreate,
        AdminAdminList,
        AdminAdminShowMe,
        AdminAdminShow,
        AdminAdminUpdateMe,
        AdminAdminUpdate,
        AdminAdminDelete
    ]
})

export default class AdminAdminModule {}

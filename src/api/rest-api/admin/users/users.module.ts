import { Module }          from '@nestjs/common';
import AdminSessionModule  from '../sessions/sessions.module';
import AdminUserController from './users.controller';
import AdminUserList       from './useCases/List.useCase';
import AdminUserShow       from './useCases/Show.useCase';
import AdminUserUpdate     from './useCases/Update.useCase';

@Module({
    imports : [
        AdminSessionModule
    ],
    controllers : [ AdminUserController ],
    providers   : [
        AdminUserList,
        AdminUserShow,
        AdminUserUpdate
    ]
})

export default class AdminUserModule {}

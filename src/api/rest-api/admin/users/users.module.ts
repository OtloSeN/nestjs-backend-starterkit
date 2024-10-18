import { Module }          from '@nestjs/common';
import AdminSessionModule  from '../sessions/sessions.module';
import AdminUserController from './users.controller';

@Module({
    imports     : [ AdminSessionModule ],
    controllers : [ AdminUserController ],
    providers   : [
    ]
})
export default class AdminUserModule {}

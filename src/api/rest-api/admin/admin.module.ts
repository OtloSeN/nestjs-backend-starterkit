import { Module }         from '@nestjs/common';
import CustomRouterModule from '@common/CustomRouterModule';
import AdminSessionModule from './sessions/sessions.module';
import AdminRoleModule    from './roles/roles.module';
import AdminAdminModule   from './admins/admins.module';
import AdminUserModule    from './users/users.module';

const modules = [
    AdminSessionModule,
    AdminRoleModule,
    AdminAdminModule,
    AdminUserModule
];

@Module({
    imports : [
        CustomRouterModule.register('/admin-api/v1', modules),
        ...modules
    ]
})
export default class AdminModule {}

import { Module }         from '@nestjs/common';
import CustomRouterModule from '@common/CustomRouterModule';
import AdminSessionModule from './sessions/sessions.module';
import AdminRoleModule    from './roles/roles.module';

const modules = [
    AdminSessionModule,
    AdminRoleModule
];

@Module({
    imports : [
        CustomRouterModule.register('/admin-api/v1', modules),
        ...modules
    ]
})
export default class AdminModule {}

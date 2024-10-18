import { Module }         from '@nestjs/common';
import CustomRouterModule from '@common/CustomRouterModule';
import AdminSessionModule from './sessions/sessions.module';
import AdminUserModule    from './users/users.module';

const modules = [
    AdminSessionModule,
    AdminUserModule
];

@Module({
    imports : [
        CustomRouterModule.register('/admin-api/v1', modules),
        ...modules
    ]
})
export default class AdminModule {}

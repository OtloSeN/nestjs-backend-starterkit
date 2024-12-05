import { Module }              from '@nestjs/common';
import AdminSessionModule      from '../sessions/sessions.module';
import AdminRoleController     from './roles.controller';
import AdminRoleCreate         from './useCases/Create.useCase';
import AdminRoleList           from './useCases/List.useCase';
import AdminRoleShow           from './useCases/Show.useCase';
import AdminRoleUpdate         from './useCases/Update.useCase';
import AdminRoleDelete         from './useCases/Delete.useCase';
import AdminRolePermissionList from './useCases/ListPermissions';

@Module({
    imports : [
        AdminSessionModule
    ],
    controllers : [ AdminRoleController ],
    providers   : [
        AdminRoleCreate,
        AdminRoleList,
        AdminRoleShow,
        AdminRoleUpdate,
        AdminRoleDelete,
        AdminRolePermissionList
    ]
})

export default class AdminRoleModule {}

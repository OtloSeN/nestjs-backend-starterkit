import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags }                                         from '@nestjs/swagger';
import RequiredAdminPermissions                                                from '@common/decorators/requiredPermission.decorator';
import { RolePermissions }                                                     from '@domainModels/Role';
import AdminSessionGuard                                                       from '../sessions/sessions.guard';
import AdminRoleCreate, { AdminRoleCreateParams, AdminRoleCreateReturn }       from './useCases/Create.useCase';
import AdminRoleList, { AdminRoleListParams, AdminRoleListReturn }             from './useCases/List.useCase';
import AdminRoleShow, { AdminRoleShowReturn }                                  from './useCases/Show.useCase';
import AdminRoleUpdate, { AdminRoleUpdateBody, AdminRoleUpdateReturn }         from './useCases/Update.useCase';
import AdminRoleDelete, { AdminRoleDeleteReturn }                              from './useCases/Delete.useCase';
import AdminRolePermissionList, { AdminRolePermissionListReturn }              from './useCases/ListPermissions';

@ApiTags('Roles')
@Controller('/roles')
@RequiredAdminPermissions([ RolePermissions.ROLE_MANAGEMENT ])
@UseGuards(AdminSessionGuard)
export default class AdminRoleController {
    constructor(
        private readonly adminRoleCreate: AdminRoleCreate,
        private readonly adminRoleList: AdminRoleList,
        private readonly adminRoleShow: AdminRoleShow,
        private readonly adminRoleUpdate: AdminRoleUpdate,
        private readonly adminRoleDelete: AdminRoleDelete,
        private readonly adminRolePermissionList: AdminRolePermissionList
    ) {}

    @Post('/')
    @ApiCreatedResponse({ type: AdminRoleCreateReturn })
    createRole(@Body() body: AdminRoleCreateParams) {
        return this.adminRoleCreate.run({
            data : body
        });
    }

    @Get('/')
    @ApiCreatedResponse({ type: AdminRoleListReturn })
    listRoles(@Query() query: AdminRoleListParams) {
        return this.adminRoleList.run({
            data : query
        });
    }

    @Get('/permissions')
    @ApiCreatedResponse({ type: AdminRolePermissionListReturn })
    listRolePermissions() {
        return this.adminRolePermissionList.run();
    }

    @Get('/:id')
    @ApiCreatedResponse({ type: AdminRoleShowReturn })
    showRole(@Param('id') id: number) {
        return this.adminRoleShow.run({
            data : {
                id
            }
        });
    }

    @Patch('/:id')
    @ApiCreatedResponse({ type: AdminRoleUpdateReturn })
    updateRole(@Param('id') id: number, @Body() body: AdminRoleUpdateBody) {
        return this.adminRoleUpdate.run({
            data : {
                id,
                ...body
            }
        });
    }

    @Delete('/:id')
    @ApiCreatedResponse({ type: AdminRoleDeleteReturn })
    deleteRole(@Param('id') id: number) {
        return this.adminRoleDelete.run({
            data : {
                id
            }
        });
    }
}

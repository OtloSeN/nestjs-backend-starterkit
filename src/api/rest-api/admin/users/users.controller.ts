import { Body, Controller, Get, Param, Patch, Query, UseGuards }       from '@nestjs/common';
import { ApiOkResponse, ApiTags }                                      from '@nestjs/swagger';
import RequiredAdminPermissions                                        from '@common/decorators/requiredPermission.decorator';
import { RolePermissions }                                             from '@domainModels/Role';
import AdminSessionGuard                                               from '../sessions/sessions.guard';
import AdminUserList, { AdminUserListParams, AdminUserListReturn }     from './useCases/List.useCase';
import AdminUserShow, { AdminUserShowReturn }                          from './useCases/Show.useCase';
import AdminUserUpdate, { AdminUserUpdateBody, AdminUserUpdateReturn } from './useCases/Update.useCase';

@ApiTags('Users')
@Controller('/users')
@RequiredAdminPermissions([ RolePermissions.USER_MANAGEMENT ])
@UseGuards(AdminSessionGuard)
export default class AdminUserController {
    constructor(
        private readonly adminUserList: AdminUserList,
        private readonly adminUserShow: AdminUserShow,
        private readonly adminUserUpdate: AdminUserUpdate
    ) {}

    @Get('/')
    @ApiOkResponse({ type: AdminUserListReturn })
    listRoles(@Query() query: AdminUserListParams) {
        return this.adminUserList.run({
            data : query
        });
    }

    @Get('/:id')
    @ApiOkResponse({ type: AdminUserShowReturn })
    showRole(@Param('id') id: number) {
        return this.adminUserShow.run({
            data : {
                id
            }
        });
    }

    @Patch('/:id')
    @ApiOkResponse({ type: AdminUserUpdateReturn })
    updateRole(@Param('id') id: number, @Body() body: AdminUserUpdateBody) {
        return this.adminUserUpdate.run({
            data : {
                id,
                ...body
            }
        });
    }
}

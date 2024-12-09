import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards }    from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags }                             from '@nestjs/swagger';
import RequiredAdminPermissions                                                   from '@common/decorators/requiredPermission.decorator';
import { RolePermissions }                                                        from '@domainModels/Role';
import { AdminSessionDto }                                                        from '@common/dto';
import AdminSessionGuard                                                          from '../sessions/sessions.guard';
import AdminSessionContext                                                        from '../sessions/sessionContext.decorator';
import AdminAdminCreate, { AdminAdminCreateParams, AdminAdminCreateReturn }       from './useCases/Create.useCase';
import AdminAdminList, { AdminAdminListParams, AdminAdminListReturn }             from './useCases/List.useCase';
import AdminAdminShowMe, { AdminAdminShowMeReturn }                               from './useCases/ShowMe.useCase';
import AdminAdminShow, { AdminAdminShowReturn }                                   from './useCases/Show.useCase';
import AdminAdminUpdateMe, { AdminAdminUpdateMeParams, AdminAdminUpdateMeReturn } from './useCases/UpdateMe.useCase';
import AdminAdminUpdate, { AdminAdminUpdateBody, AdminAdminUpdateReturn }         from './useCases/Update.useCase';
import AdminAdminDelete, { AdminAdminDeleteReturn }                               from './useCases/Delete.useCase';

@ApiTags('Admins')
@Controller('/admins')
@UseGuards(AdminSessionGuard)
export default class AdminAdminController {
    constructor(
        private readonly adminAdminCreate: AdminAdminCreate,
        private readonly adminAdminList: AdminAdminList,
        private readonly adminAdminShowMe: AdminAdminShowMe,
        private readonly adminAdminShow: AdminAdminShow,
        private readonly adminAdminUpdateMe: AdminAdminUpdateMe,
        private readonly adminAdminUpdate: AdminAdminUpdate,
        private readonly adminAdminDelete: AdminAdminDelete,
    ) {}

    @Post('/')
    @ApiCreatedResponse({ type: AdminAdminCreateReturn })
    @RequiredAdminPermissions([ RolePermissions.ADMIN_MANAGEMENT, RolePermissions.ROLE_MANAGEMENT ])
    createAdmin(@Body() body: AdminAdminCreateParams) {
        return this.adminAdminCreate.run({
            data : body
        });
    }

    @Get('/')
    @ApiOkResponse({ type: AdminAdminListReturn })
    @RequiredAdminPermissions([ RolePermissions.ADMIN_MANAGEMENT, RolePermissions.ROLE_MANAGEMENT ])
    listAdmins(@Query() query: AdminAdminListParams) {
        return this.adminAdminList.run({
            data : query
        });
    }

    @Get('/me')
    @ApiOkResponse({ type: AdminAdminShowMeReturn })
    showMe(@AdminSessionContext() sessionContext: AdminSessionDto) {
        return this.adminAdminShowMe.run({
            sessionContext
        });
    }

    @Get('/:id')
    @ApiOkResponse({ type: AdminAdminShowReturn })
    @RequiredAdminPermissions([ RolePermissions.ADMIN_MANAGEMENT, RolePermissions.ROLE_MANAGEMENT ])
    showAdminById(@Param('id') id: number) {
        return this.adminAdminShow.run({
            data : { id }
        });
    }

    @Patch('/me')
    @ApiOkResponse({ type: AdminAdminUpdateMeReturn })
    updateMe(@Body() body: AdminAdminUpdateMeParams, @AdminSessionContext() sessionContext: AdminSessionDto) {
        return this.adminAdminUpdateMe.run({
            data : body,
            sessionContext
        });
    }

    @Patch('/:id')
    @ApiOkResponse({ type: AdminAdminUpdateReturn })
    @RequiredAdminPermissions([ RolePermissions.ADMIN_MANAGEMENT, RolePermissions.ROLE_MANAGEMENT ])
    updateAdminById(@Param('id') id: number, @Body() body: AdminAdminUpdateBody) {
        return this.adminAdminUpdate.run({
            data : {
                id,
                ...body
            }
        });
    }

    @Delete('/:id')
    @ApiCreatedResponse({ type: AdminAdminDeleteReturn })
    @RequiredAdminPermissions([ RolePermissions.ADMIN_MANAGEMENT, RolePermissions.ROLE_MANAGEMENT ])
    deleteAdmin(@Param('id') id: number, @AdminSessionContext() sessionContext: AdminSessionDto) {
        return this.adminAdminDelete.run({
            data : { id },
            sessionContext
        });
    }
}

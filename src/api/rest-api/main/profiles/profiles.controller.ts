import { Body, Controller, Delete, Get, Patch, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiTags }                from '@nestjs/swagger';
import IsPublic                                                                                  from '@common/decorators/isPublic.decorator';
import { AnyFilesInterceptor }                                                                   from '@nestjs/platform-express';
import mergeBodyWithFiles                                                                        from '@common/utils/mergeBodyWithFiles';
import AllowedUserStatuses                                                                       from '@common/decorators/allowedStatuses.decorator';
import { UserStatuses }                                                                          from '@domainModels/User';
import { UserSessionDto }                                                                        from '@common/dto';
import MainSessionGuard                                                                          from '../sessions/sessions.guard';
import MainSessionContext                                                                        from '../sessions/sessionContext.decorator';
import MainProfileCreate, { MainProfileCreateParams, MainProfileCreateReturn }                   from './useCases/Create.useCase';
import MainProfileShow, { MainProfileShowReturn }                                                from './useCases/Show.useCase';
import MainProfileUpdate, { MainProfileUpdateParams, MainProfileUpdateReturn }                   from './useCases/Update.useCase';
import MainProfileDelete                                                                         from './useCases/Delete.useCase';
import MainProfileResetPassword, { MainProfileResetPasswordParams }                              from './useCases/ResetPassword.useCase';

@ApiTags('Profiles')
@Controller('/profiles')
@AllowedUserStatuses([ UserStatuses.ACTIVE ])
@UseGuards(MainSessionGuard)
export default class MainProfileController {
    constructor(
        private readonly mainProfileCreate: MainProfileCreate,
        private readonly mainProfileShow: MainProfileShow,
        private readonly mainProfileUpdate: MainProfileUpdate,
        private readonly mainProfileDelete: MainProfileDelete,
        private readonly mainProfileResetPassword: MainProfileResetPassword,
    ) {}

    @Post('/')
    @ApiConsumes('multipart/form-data')
    @ApiCreatedResponse({ type: MainProfileCreateReturn })
    @UseInterceptors(AnyFilesInterceptor())
    @IsPublic()
    createProfile(
    @Body() body: MainProfileCreateParams,
        @UploadedFiles() files: Express.Multer.File[]
    ) {
        return this.mainProfileCreate.run({
            data : mergeBodyWithFiles(body, files)
        });
    }

    @Get('/')
    @ApiBearerAuth()
    @ApiOkResponse({ type: MainProfileShowReturn })
    showProfile(@MainSessionContext() sessionContext: UserSessionDto) {
        return this.mainProfileShow.run({
            sessionContext
        });
    }

    @Patch('/')
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiOkResponse({ type: MainProfileUpdateReturn })
    @UseInterceptors(AnyFilesInterceptor())
    updateProfile(
    @Body() body: MainProfileUpdateParams,
        @UploadedFiles() files: Express.Multer.File[],
        @MainSessionContext() sessionContext: UserSessionDto
    ) {
        return this.mainProfileUpdate.run({
            data : mergeBodyWithFiles(body, files),
            sessionContext
        });
    }

    @Delete('/')
    @ApiBearerAuth()
    @ApiOkResponse()
    deleteProfile(@MainSessionContext() sessionContext: UserSessionDto) {
        return this.mainProfileDelete.run({
            sessionContext
        });
    }

    @Post('/reset-password')
    @ApiCreatedResponse()
    @IsPublic()
    resetPassword(@Body() body: MainProfileResetPasswordParams) {
        return this.mainProfileResetPassword.run({
            data : body
        });
    }
}

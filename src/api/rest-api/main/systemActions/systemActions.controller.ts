import { Body, Controller, Get, Param, Post }                                 from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags }                         from '@nestjs/swagger';
import MainSystemActionShow, { MainSystemActionShowReturn }                   from './useCases/Show.useCase';
import MainSystemActionPasswordReset, { MainSystemActionPasswordResetParams } from './useCases/ResetPassword.useCase';

@ApiTags('System actions')
@Controller('/system-actions')
export default class MainSystemActionsController {
    constructor(
        private readonly mainSystemActionShow: MainSystemActionShow,
        private readonly mainSystemActionPasswordReset: MainSystemActionPasswordReset,
    ) {}

    @Get('/:id')
    @ApiOkResponse({ type: MainSystemActionShowReturn })
    showSystemActions(
    @Param('id') id: string,
    ) {
        return this.mainSystemActionShow.run({
            data : { id }
        });
    }

    @Post('/password-reset')
    @ApiCreatedResponse()
    async createPasswordReset(@Body() body: MainSystemActionPasswordResetParams) {
        return this.mainSystemActionPasswordReset.run({
            data : body
        });
    }
}

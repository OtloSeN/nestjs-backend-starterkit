import { Body, Controller, Post }                                                 from '@nestjs/common';
import { ApiCreatedResponse, ApiTags }                                            from '@nestjs/swagger';
import AdminSessionCreate, { AdminSessionCreateParams, AdminSessionCreateReturn } from './useCases/Create.useCase';

@ApiTags('Sessions')
@Controller('/sessions')
export default class AdminSessionController {
    constructor(
        private readonly adminSessionCreate: AdminSessionCreate
    ) {}

    @Post('/')
    @ApiCreatedResponse({ type: AdminSessionCreateReturn })
    createSession(@Body() body: AdminSessionCreateParams) {
        return this.adminSessionCreate.run({
            data : body
        });
    }
}

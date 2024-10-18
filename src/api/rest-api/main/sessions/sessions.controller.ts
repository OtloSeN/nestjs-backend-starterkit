import { Body, Controller, Post }                                              from '@nestjs/common';
import { ApiCreatedResponse, ApiTags }                                         from '@nestjs/swagger';
import IsPublic                                                                from '@common/decorators/isPublic.decorator';
import MainSessionCreate, { MainSessionCreateParams, MainSessionCreateReturn } from './useCases/Create.useCase';

@ApiTags('Sessions')
@Controller('/sessions')
export default class MainSessionController {
    constructor(
        private readonly mainSessionCreate: MainSessionCreate
    ) {}

    @Post('/')
    @ApiCreatedResponse({ type: MainSessionCreateReturn })
    @IsPublic()
    createSession(@Body() body: MainSessionCreateParams) {
        return this.mainSessionCreate.run({
            data : body
        });
    }
}

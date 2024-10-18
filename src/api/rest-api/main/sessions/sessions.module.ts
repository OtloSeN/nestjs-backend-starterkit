import { Module }            from '@nestjs/common';
import MainSessionController from './sessions.controller';
import MainSessionGuard      from './sessions.guard';
import MainSessionCreate     from './useCases/Create.useCase';
import MainSessionCheck      from './useCases/Check.useCase';

@Module({
    controllers : [ MainSessionController ],
    providers   : [
        MainSessionGuard,
        MainSessionCreate,
        MainSessionCheck
    ],
    exports : [
        MainSessionCheck
    ]
})
export default class MainSessionModule {}

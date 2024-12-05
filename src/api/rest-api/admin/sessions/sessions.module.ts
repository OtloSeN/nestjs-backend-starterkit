import { Module }             from '@nestjs/common';
import AdminSessionController from './sessions.controller';
import AdminSessionCreate     from './useCases/Create.useCase';
import AdminSessionCheck      from './useCases/Check.useCase';

@Module({
    controllers : [ AdminSessionController ],
    providers   : [
        AdminSessionCreate,
        AdminSessionCheck
    ],
    exports : [
        AdminSessionCheck
    ]
})

export default class AdminSessionModule {}

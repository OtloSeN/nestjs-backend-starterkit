import { Module }             from '@nestjs/common';
import AdminSessionController from './sessions.controller';
import AdminSessionCheck      from './useCases/Check.useCase';

@Module({
    controllers : [ AdminSessionController ],
    providers   : [
        AdminSessionCheck
    ],
    exports : [
        AdminSessionCheck
    ]
})
export default class AdminSessionModule {}

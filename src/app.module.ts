import { Module }              from '@nestjs/common';
import AppConfigModule         from 'configs/appConfig.module';
import AsyncLocalStorageModule from 'lib/asyncLocalStorage/asl.module';
import LoggerModule            from 'lib/logger/logger.module';
import EmailSenderModule       from 'lib/email/emailSender.module';
import RestApiModule           from './api/rest-api/restAPI.module';

@Module({
    imports : [
        AppConfigModule,
        RestApiModule,
        AsyncLocalStorageModule,
        LoggerModule,
        EmailSenderModule
    ]
})
export default class AppModule {}

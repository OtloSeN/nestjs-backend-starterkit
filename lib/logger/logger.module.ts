import { Global, Module, Scope } from '@nestjs/common';
import { Logger }                from 'winston';
import { CONFIG_PROVIDER_KEY }   from 'configs/appConfig';
import IAppConfig                from 'configs/interfaces/IAppConfig';
import { ASL_PROVIDER_KEY }      from 'lib/asyncLocalStorage/asl.module';
import { TAsyncLocalStorage }    from 'lib/asyncLocalStorage/asyncLocalStorage';
import LoggerService             from './logger.service';
import LoggerFactory             from './LoggerFactory';

const WINSTON_LOGGER_PROVIDER_KEY = 'WINSTON_LOGGER_PROVIDER';

@Global()
@Module({
    providers : [
        {
            provide : WINSTON_LOGGER_PROVIDER_KEY,
            useFactory(appConfig: IAppConfig, asl: TAsyncLocalStorage) {
                return LoggerFactory.createLogger({
                    asl,
                    ...appConfig.logger
                });
            },
            inject : [
                { token: CONFIG_PROVIDER_KEY, optional: false },
                { token: ASL_PROVIDER_KEY, optional: false }
            ]
        },
        {
            scope   : Scope.TRANSIENT,
            provide : LoggerService,
            useFactory(winstonLogger: Logger) {
                return new LoggerService(winstonLogger);
            },
            inject : [ { token: WINSTON_LOGGER_PROVIDER_KEY, optional: false } ]
        }
    ],
    exports : [
        LoggerService
    ]
})
export default class LoggerModule {}

import { Module }              from '@nestjs/common';
import ApplicationConfig       from 'configs/appConfig.module';
import LoggerModule            from 'lib/logger/logger.module';
import AsyncLocalStorageModule from 'lib/asyncLocalStorage/asl.module';
import WorkerCreateAdmin       from './workers/createAdmin';

@Module({
    imports : [
        ApplicationConfig,
        LoggerModule,
        AsyncLocalStorageModule
    ],
    providers : [
        WorkerCreateAdmin
    ]
})
export default class WorkerModule {}

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER }                             from '@nestjs/core';
import { ServerErrorExceptionFilter }             from '@common/filters/serverError.filter';
import AdminModule                                from './admin/admin.module';
import MainModule                                 from './main/main.module';
import AslContextMiddleware                       from './middlewares/aslContext';

@Module({
    imports : [
        AdminModule,
        MainModule
    ],
    providers : [
        {
            provide  : APP_FILTER,
            useClass : ServerErrorExceptionFilter
        }
    ]
})
export default class RestApiModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AslContextMiddleware).forRoutes('*');
    }
}

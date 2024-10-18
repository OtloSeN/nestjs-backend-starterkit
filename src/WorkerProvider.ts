import { NestFactory } from '@nestjs/core';
import AppProvider     from './AppProvider';
import WorkerModule    from './worker.module';


export default class WorkerProvider extends AppProvider {
    getNestApplication() {
        return this.nestApplication;
    }

    async initNestApplication() {
        this.nestApplication = await NestFactory.create(WorkerModule, {
            logger : this.logger
        });
    }
}

/* eslint-disable more/no-then */
import 'reflect-metadata';
import { program }             from 'commander';
import { BadRequestException } from '@common/exceptions/BadRequestException';
import WorkerProvider          from 'src/WorkerProvider';
import appConfig               from 'configs/appConfig';
import CreateAdmin             from 'src/workers/createAdmin';
import SeedRoles               from 'src/workers/seedRoles';

const WORKERS = {
    SeedRoles,
    CreateAdmin
};

program.argument('<serviceName>', 'Service to run');

program.action(async (serviceName: string) => {
    const workerProvider = new WorkerProvider(appConfig);

    await workerProvider.initApp();

    const nestApplication = workerProvider.getNestApplication();

    const service = nestApplication.get(WORKERS[serviceName]);

    await service.run({
        data : program.opts()
    });
});

program
    .parseAsync(process.argv)
    .then(() => process.exit(0))
    .catch(err => {
        if (err instanceof BadRequestException) {
            console.log(JSON.stringify(err.getResponse(), null, 4));
        } else {
            console.log(err);
        }

        process.exit(1);
    });

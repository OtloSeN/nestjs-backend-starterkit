import BaseUseCase    from '@common/BaseUseCase';
import Admin          from 'src/domain/models/Admin';
import { Injectable } from '@nestjs/common';
import { program }    from 'commander';
import Joi            from 'joi';

program
    .option('-e, --email <email>', 'Admin email')
    .option('-p, --password <password>', 'Admin password');

interface IWorkerCreateAdminParams {
    email    : string;
    password : string
}

@Injectable()
export default class WorkerCreateAdmin extends BaseUseCase<IWorkerCreateAdminParams, unknown, undefined> {
    protected validationSchema = Joi.object<IWorkerCreateAdminParams>({
        email    : Joi.string().email().required(),
        password : Joi.string().required()
    });

    protected async execute(data?: IWorkerCreateAdminParams): Promise<undefined> {
        await Admin.register(data);
    }
}

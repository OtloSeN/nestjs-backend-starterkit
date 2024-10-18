import { Injectable }       from '@nestjs/common';
import BaseUseCase          from '@common/BaseUseCase';
import Joi                  from 'joi';
import { ApiProperty }      from '@nestjs/swagger';
import SystemAction         from '@domainModels/SystemAction';
import { DateTime }         from 'luxon';
import { dumpSystemAction } from '@common/dumps';
import { SystemActionDto }  from '@common/dto';

export class MainSystemActionShowParams {
    @ApiProperty()
    id : string;
}

export class MainSystemActionShowReturn extends SystemActionDto {}

@Injectable()
export default class MainSystemActionShow extends BaseUseCase<
    MainSystemActionShowParams,
    undefined,
    MainSystemActionShowReturn
> {
    protected validationSchema = Joi.object<MainSystemActionShowParams>({
        id : Joi.string().uuid().required()
    });

    protected async execute({ id }: MainSystemActionShowParams) {
        await SystemAction.createQueryBuilder('actions').delete()
            .where('expiresAt < :expiresAt', { expiresAt: DateTime.utc().toJSDate() })
            .useTransaction(false)
            .execute();

        const action = await SystemAction.findOneOrThrow({
            where : { id }
        });

        return dumpSystemAction(action);
    }
}

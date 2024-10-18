import Joi                               from 'joi';
import { Transactional }                 from 'typeorm-transactional';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from '@common/constants';
import { BadRequestException }           from './exceptions/BadRequestException';

export default abstract class BaseUseCase<UseCaseParams, SessionContext, UseCaseReturn> {
    protected readonly DEFAULT_LIMIT = DEFAULT_LIMIT;

    protected readonly DEFAULT_OFFSET = DEFAULT_OFFSET;

    protected validationSchema? : Joi.ObjectSchema<UseCaseParams>;

    protected sessionContext? : SessionContext;

    protected async validate(data: UseCaseParams): Promise<UseCaseParams> {
        if (!this.validationSchema) return data;

        const validatedData = await this.validationSchema.validateAsync(data, {
            allowUnknown : false,
            abortEarly   : false,
            stripUnknown : true
        });

        return validatedData;
    }

    private handleException(err: unknown) {
        if (err instanceof Joi.ValidationError) {
            throw new BadRequestException({
                code    : 'FORMAT_ERROR',
                details : err.details.map(error => {
                    return {
                        path : error.path,
                        type : error.type
                    };
                })
            });
        }

        throw err;
    }

    protected abstract execute(data?: UseCaseParams): Promise<UseCaseReturn>;

    @Transactional()
    async run(params: { data?: UseCaseParams, sessionContext?: SessionContext } = {}): Promise<UseCaseReturn> {
        this.sessionContext = params.sessionContext;

        try {
            const validatedData = await this.validate(params.data);

            return this.execute(validatedData);
        } catch (error) {
            this.handleException(error);
        }
    }
}

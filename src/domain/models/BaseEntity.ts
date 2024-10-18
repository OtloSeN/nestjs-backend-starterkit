import { NotFoundException, NotUniqueException } from '@common/exceptions';
import { MAX_SQL_INTEGER }                       from '@common/constants';
import {
    DeepPartial,
    EntityNotFoundError,
    FindOneOptions,
    QueryFailedError,
    SaveOptions,
    BaseEntity as TypeormBaseEntity
} from 'typeorm';
import ExtendedQueryBuilder from '../ExtendedQueryBuilder';

export default abstract class BaseEntity extends TypeormBaseEntity {
    static MAX_SQL_INTEGER = MAX_SQL_INTEGER;

    /**
     *
     *  `this: { new (): ChildClass } & typeof BaseEntity`
     *   is used to automatically infer type of ChildClass
     */
    static async findOneOrThrow<ChildClass extends BaseEntity>(
        this: { new (): ChildClass } & typeof BaseEntity,
        options: FindOneOptions<ChildClass>
    ): Promise<ChildClass> {
        try {
            const entity = await this.getRepository<ChildClass>().findOneOrFail(options);

            return entity;
        } catch (err) {
            if (err instanceof EntityNotFoundError) {
                throw new NotFoundException({
                    code : `${this.name.toUpperCase()}_NOT_FOUND`
                });
            }

            throw err;
        }
    }

    static async createAndSave<ChildClass extends BaseEntity>(
        this: { new (): ChildClass } & typeof BaseEntity,
        data: DeepPartial<ChildClass>
    ): Promise<ChildClass> {
        const entity = this.getRepository<ChildClass>().create(data);

        return entity.save();
    }

    async save(saveOptions?: SaveOptions) {
        try {
            return await super.save(saveOptions);
        } catch (error) {
            /* istanbul ignore if */
            if (error instanceof QueryFailedError && error.driverError.code === 'ER_DUP_ENTRY') {
                throw new NotUniqueException({
                    code : `${this.constructor.name.toUpperCase()}_NOT_UNIQUE`
                });
            } else {
                throw error;
            }
        }
    }

    update(data: DeepPartial<this>,  options?: SaveOptions) {
        Object.assign(this, data);

        return this.save(options);
    }

    static createExtendedQueryBuilder<ChildClass extends BaseEntity>(
        this: { new (): ChildClass } & typeof BaseEntity,
        alias?: string
    ): ExtendedQueryBuilder<ChildClass> {
        const queryBuilder = this.getRepository<ChildClass>().createQueryBuilder(alias);

        return new ExtendedQueryBuilder(queryBuilder);
    }
}

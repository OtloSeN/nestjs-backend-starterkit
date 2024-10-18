import { Brackets, ObjectLiteral, SelectQueryBuilder } from 'typeorm';

class ExtendedQueryBuilder<Entity extends ObjectLiteral> extends SelectQueryBuilder<Entity> {
    andWhereOptional(
        condition: string | Brackets | ObjectLiteral | ObjectLiteral[] | ((qb: this) => string) | undefined,
        parameters?: object | undefined
    ): ExtendedQueryBuilder<Entity> {
        if (!condition) return this;

        const allParamsArePassed = !parameters || Object.values(parameters).every(param => {
            if (Array.isArray(param)) return !!param.length;

            return param !== undefined;
        });

        if (allParamsArePassed) {
            this.andWhere(condition, parameters);
        }

        return this;
    }
}

export default ExtendedQueryBuilder;

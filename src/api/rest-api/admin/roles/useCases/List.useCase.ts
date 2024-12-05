import { Injectable }                                from '@nestjs/common';
import Joi                                           from 'joi';
import BaseUseCase                                   from '@common/BaseUseCase';
import { ApiProperty, ApiPropertyOptional }          from '@nestjs/swagger';
import { AdminSessionDto, ListMetadataDto, RoleDto } from '@common/dto';
import Role                                          from '@domainModels/Role';
import { dumpRole }                                  from '@common/dumps';

export class AdminRoleListParams {
    @ApiPropertyOptional({ default: 20 })
    limit : number;

    @ApiPropertyOptional({ default: 0 })
    offset : number;

    @ApiPropertyOptional({ default: 'createdAt', enum: [ 'id', 'name', 'createdAt', 'updatedAt' ] })
    orderBy : 'id' | 'name' | 'createdAt' | 'updatedAt';

    @ApiPropertyOptional({ default: 'DESC' })
    order : 'ASC' | 'DESC';

    @ApiPropertyOptional()
    search : string;
}

export class AdminRoleListReturn {
    @ApiProperty({ type: RoleDto, isArray: true })
    data : RoleDto[];

    @ApiProperty({ type: ListMetadataDto })
    meta : ListMetadataDto;
}

@Injectable()
export default class AdminRoleList extends BaseUseCase<
    AdminRoleListParams,
    AdminSessionDto,
    AdminRoleListReturn
> {
    protected validationSchema = Joi.object<AdminRoleListParams>({
        limit   : Joi.number().integer().positive().default(this.DEFAULT_LIMIT),
        offset  : Joi.number().integer().min(0).default(this.DEFAULT_OFFSET),
        orderBy : Joi.string().valid('id', 'name', 'createdAt', 'updatedAt').default('createdAt'),
        order   : Joi.string().valid('ASC', 'DESC').default('DESC'),
        search  : Joi.string().trim().min(1)
    });

    protected async execute({ limit, offset, orderBy, order, ...filters }: AdminRoleListParams) {
        const [ roles, totalCount ] = await Role.createExtendedQueryBuilder('roles')
            .limit(limit)
            .offset(offset)
            .orderBy(`roles.${orderBy}`, order)
            .andWhereOptional('roles.name like :search', { search: filters.search && `%${filters.search}%` })
            .getManyAndCount();

        return {
            data : roles.map(dumpRole),
            meta : {
                totalCount
            }
        };
    }
}

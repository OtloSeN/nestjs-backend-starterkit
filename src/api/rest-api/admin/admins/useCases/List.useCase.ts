import { Injectable }                                 from '@nestjs/common';
import Joi                                            from 'joi';
import BaseUseCase                                    from '@common/BaseUseCase';
import { ApiProperty, ApiPropertyOptional }           from '@nestjs/swagger';
import { AdminDto, AdminSessionDto, ListMetadataDto } from '@common/dto';
import Admin                                          from '@domainModels/Admin';
import { dumpAdmin }                                  from '@common/dumps';

export class AdminAdminListParams {
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

export class AdminAdminListReturn {
    @ApiProperty({ type: AdminDto, isArray: true })
    data : AdminDto[];

    @ApiProperty({ type: ListMetadataDto })
    meta : ListMetadataDto;
}

@Injectable()
export default class AdminAdminList extends BaseUseCase<
    AdminAdminListParams,
    AdminSessionDto,
    AdminAdminListReturn
> {
    protected validationSchema = Joi.object<AdminAdminListParams>({
        limit   : Joi.number().integer().positive().default(this.DEFAULT_LIMIT),
        offset  : Joi.number().integer().min(0).default(this.DEFAULT_OFFSET),
        orderBy : Joi.string().valid('id', 'name', 'createdAt', 'updatedAt').default('createdAt'),
        order   : Joi.string().valid('ASC', 'DESC').default('DESC'),
        search  : Joi.string().trim().min(1)
    });

    protected async execute({ limit, offset, orderBy, order, ...filters }: AdminAdminListParams) {
        const [ admins, totalCount ] = await Admin.createExtendedQueryBuilder('admins')
            .limit(limit)
            .offset(offset)
            .orderBy(`admins.${orderBy}`, order)
            .andWhereOptional('admins.email like :search', { search: filters.search && `%${filters.search}%` })
            .getManyAndCount();

        return {
            data : admins.map(dumpAdmin),
            meta : {
                totalCount
            }
        };
    }
}

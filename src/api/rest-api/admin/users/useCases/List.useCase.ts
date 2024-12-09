import { Injectable }                                from '@nestjs/common';
import Joi                                           from 'joi';
import BaseUseCase                                   from '@common/BaseUseCase';
import { ApiProperty, ApiPropertyOptional }          from '@nestjs/swagger';
import { AdminSessionDto, ListMetadataDto, UserDto } from '@common/dto';
import { dumpUser }                                  from '@common/dumps';
import User                                          from '@domainModels/User';

export class AdminUserListParams {
    @ApiPropertyOptional({ default: 20 })
    limit : number;

    @ApiPropertyOptional({ default: 0 })
    offset : number;

    @ApiPropertyOptional({ default: 'createdAt', enum: [ 'id', 'email', 'createdAt', 'updatedAt' ] })
    orderBy : 'id' | 'name' | 'createdAt' | 'updatedAt';

    @ApiPropertyOptional({ default: 'DESC' })
    order : 'ASC' | 'DESC';

    @ApiPropertyOptional()
    search : string;
}

export class AdminUserListReturn {
    @ApiProperty({ type: UserDto, isArray: true })
    data : UserDto[];

    @ApiProperty({ type: ListMetadataDto })
    meta : ListMetadataDto;
}

@Injectable()
export default class AdminUserList extends BaseUseCase<
    AdminUserListParams,
    AdminSessionDto,
    AdminUserListReturn
> {
    protected validationSchema = Joi.object<AdminUserListParams>({
        limit   : Joi.number().integer().positive().default(this.DEFAULT_LIMIT),
        offset  : Joi.number().integer().min(0).default(this.DEFAULT_OFFSET),
        orderBy : Joi.string().valid('id', 'name', 'createdAt', 'updatedAt').default('createdAt'),
        order   : Joi.string().valid('ASC', 'DESC').default('DESC'),
        search  : Joi.string().trim().min(1)
    });

    protected async execute({ limit, offset, orderBy, order, ...filters }: AdminUserListParams) {
        const [ users, totalCount ] = await User.createExtendedQueryBuilder('users')
            .limit(limit)
            .offset(offset)
            .orderBy(`users.${orderBy}`, order)
            .andWhereOptional('users.email like :search', { search: filters.search && `%${filters.search}%` })
            .getManyAndCount();

        return {
            data : await Promise.all(users.map(dumpUser)),
            meta : {
                totalCount
            }
        };
    }
}

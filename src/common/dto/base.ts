import { ApiProperty } from '@nestjs/swagger';

export class ListMetadataDto {
    @ApiProperty()
    totalCount : number;
}

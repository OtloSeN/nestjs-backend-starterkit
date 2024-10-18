import { SystemActionTypes } from '@domainModels/SystemAction';
import { ApiProperty }       from '@nestjs/swagger';

export class SystemActionDto {
    @ApiProperty()
    id : string;

    @ApiProperty()
    userId : number;

    @ApiProperty({ enum: SystemActionTypes })
    type : SystemActionTypes;

    @ApiProperty()
    payload : object;

    @ApiProperty()
    expiresAt : Date;

    @ApiProperty()
    createdAt : Date;

    constructor(args: ISystemActionDtoArgs) {
        this.id = args.id;
        this.userId = args.userId;
        this.type = args.type;
        this.payload = args.payload;
        this.expiresAt = args.expiresAt;
        this.createdAt = args.createdAt;
    }
}

interface ISystemActionDtoArgs {
    id        : string;
    userId    : number;
    type      : SystemActionTypes;
    payload   : object;
    expiresAt : Date;
    createdAt : Date;
}

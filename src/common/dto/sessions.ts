import { UserStatuses } from '@domainModels/User';
import { ApiProperty }  from '@nestjs/swagger';

export class UserSessionDto {
    @ApiProperty()
    userId : number;

    @ApiProperty()
    email : string;

    @ApiProperty({ enum: UserStatuses })
    status : UserStatuses;

    @ApiProperty()
    createdAt : Date;

    constructor(args: IUserSessionDtoArgs) {
        this.userId = args.userId;
        this.email = args.email;
        this.status = args.status;
        this.createdAt = args.createdAt;
    }
}

interface IUserSessionDtoArgs {
    userId    : number;
    email     : string;
    status    : UserStatuses;
    createdAt : Date;
}

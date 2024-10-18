import { UserStatuses } from '@domainModels/User';
import { ApiProperty }  from '@nestjs/swagger';

export class UserDto {
    @ApiProperty()
    id : number;

    @ApiProperty()
    email : string;

    @ApiProperty({ enum: UserStatuses })
    status : UserStatuses;

    @ApiProperty()
    firstName : string;

    @ApiProperty()
    lastName : string;

    @ApiProperty()
    avatarLink : string;

    @ApiProperty()
    createdAt : Date;

    @ApiProperty()
    updatedAt : Date;

    constructor(args: IUserDtoArgs) {
        this.id = args.id;
        this.email = args.email;
        this.status = args.status;
        this.firstName = args.firstName;
        this.lastName = args.lastName;
        this.avatarLink = args.avatarLink;
        this.createdAt = args.createdAt;
        this.updatedAt = args.updatedAt;
    }
}

interface IUserDtoArgs {
    id         : number;
    email      : string;
    status     : UserStatuses;
    firstName  : string;
    lastName   : string;
    avatarLink : string;
    createdAt  : Date;
    updatedAt  : Date;
}

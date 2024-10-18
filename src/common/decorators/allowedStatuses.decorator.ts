import { UserStatuses } from '@domainModels/User';
import { Reflector }    from '@nestjs/core';

const AllowedUserStatuses = Reflector.createDecorator<UserStatuses[]>();

export default AllowedUserStatuses;


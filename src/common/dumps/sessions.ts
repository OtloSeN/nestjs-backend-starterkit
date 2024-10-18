import { UserSessionDto } from '@common/dto';
import User               from '@domainModels/User';

export function dumpUserSession(user: User) {
    return new UserSessionDto({
        userId    : user.id,
        email     : user.email,
        status    : user.status,
        createdAt : user.createdAt
    });
}

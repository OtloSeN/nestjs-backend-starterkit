import { UserDto }           from '@common/dto';
import User                  from '@domainModels/User';
import { dumpSignedFileUrl } from './base';

export async function dumpUser(user: User) {
    return new UserDto({
        id         : user.id,
        email      : user.email,
        status     : user.status,
        firstName  : user.firstName,
        lastName   : user.lastName,
        avatarLink : await dumpSignedFileUrl(user.avatarPath),
        createdAt  : user.createdAt,
        updatedAt  : user.updatedAt
    });
}

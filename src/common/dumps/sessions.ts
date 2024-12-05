import { AdminSessionDto, UserSessionDto } from '@common/dto';
import Admin                               from '@domainModels/Admin';
import User                                from '@domainModels/User';
import { dumpRole }                        from './roles';

export function dumpUserSession(user: User) {
    return new UserSessionDto({
        userId    : user.id,
        email     : user.email,
        status    : user.status,
        createdAt : user.createdAt
    });
}

export function dumpAdminSession(admin: Admin) {
    return new AdminSessionDto({
        adminId   : admin.id,
        email     : admin.email,
        createdAt : admin.createdAt,
        updatedAt : admin.updatedAt,
        role      : admin.role && dumpRole(admin.role)
    });
}

import { AdminDto } from '@common/dto';
import Admin        from '@domainModels/Admin';
import { dumpRole } from './roles';

export function dumpAdmin(admin: Admin) {
    return new AdminDto({
        id        : admin.id,
        roleId    : admin.roleId,
        email     : admin.email,
        firstName : admin.firstName,
        lastName  : admin.lastName,
        createdAt : admin.createdAt,
        updatedAt : admin.updatedAt,
        role      : admin.role && dumpRole(admin.role)
    });
}

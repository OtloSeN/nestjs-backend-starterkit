import { RoleDto } from '@common/dto';
import Role        from '@domainModels/Role';

export function dumpRole(role: Role) {
    return new RoleDto({
        id          : role.id,
        name        : role.name,
        permissions : role.permissions,
        createdAt   : role.createdAt,
        updateAt    : role.updatedAt
    });
}

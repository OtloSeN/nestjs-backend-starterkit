import { RolePermissions } from '@domainModels/Role';
import { Reflector }       from '@nestjs/core';

const RequiredAdminPermissions = Reflector.createDecorator<RolePermissions[]>();

export default RequiredAdminPermissions;


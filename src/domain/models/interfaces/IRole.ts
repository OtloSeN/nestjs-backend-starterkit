import { RolePermissions } from '@domainModels/Role';

export interface IRoleCreateRole {
    name        : string;
    permissions : RolePermissions[]
}

export interface IRoleUpdateInstance {
    name?        : string;
    permissions? : RolePermissions[]
}

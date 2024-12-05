import BaseUseCase               from '@common/BaseUseCase';
import Role, { RolePermissions } from '@domainModels/Role';
import { Injectable }            from '@nestjs/common';

@Injectable()
export default class WorkerSeedRoles extends BaseUseCase<undefined, undefined, void> {
    protected async execute(): Promise<void> {
        const role = await Role.findOne({
            where : {
                name : 'superadmin'
            }
        });

        if (role) return;

        await Role.createRole({
            name        : 'superadmin',
            permissions : Object.values(RolePermissions)
        });
    }
}

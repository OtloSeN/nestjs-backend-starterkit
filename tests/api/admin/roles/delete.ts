import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import Role           from '@domainModels/Role';

export default [
    {
        title : 'Admin: Delete role',
        async test() {
            const token = await TestFactory.createAdminToken();

            const role = await TestFactory.createRole();

            const { body } = await supertest(global.provider.HttpServer)
                .delete(`/admin-api/v1/roles/${role.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(role.id);

            const roleAfterDelete = await Role.findOne({
                where : { id: role.id }
            });

            expect(roleAfterDelete).toBeNull();
        }
    },
    {
        title : 'Admin: Delete role with assigned admin',
        async test() {
            const token = await TestFactory.createAdminToken();

            const role = await TestFactory.createRole();

            await TestFactory.createAdmin({
                roleId : role.id
            });

            const { body } = await supertest(global.provider.HttpServer)
                .delete(`/admin-api/v1/roles/${role.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'ADMIN_WITH_THIS_ROLE_EXISTS' });
        }
    }
];

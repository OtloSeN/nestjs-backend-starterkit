import supertest           from 'supertest';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { faker }           from '@faker-js/faker';
import { RolePermissions } from '@domainModels/Role';

export default [
    {
        title : 'Admin: Update role',
        async test() {
            const token = await TestFactory.createAdminToken();

            const role = await TestFactory.createRole({
                permissions : [ RolePermissions.ADMIN_MANAGEMENT ]
            });

            const payload = {
                name        : faker.lorem.word(),
                permissions : [ RolePermissions.ROLE_MANAGEMENT ]
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch(`/admin-api/v1/roles/${role.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(role.id);
            expect(body.permissions.length).toEqual(1);
            expect(body.permissions.includes(RolePermissions.ADMIN_MANAGEMENT)).toEqual(false);
            expect(body.permissions.includes(RolePermissions.ROLE_MANAGEMENT)).toEqual(true);
        }
    }
];

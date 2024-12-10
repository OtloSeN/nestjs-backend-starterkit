import supertest           from 'supertest';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { RolePermissions } from '@domainModels/Role';

export default [
    {
        title : 'Admin: list all role permissions',
        async test() {
            const token = await TestFactory.createAdminToken();

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/roles/permissions')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    search : '1'
                })
                .expect(HttpStatus.OK);

            expect(body.permissions).toEqual(Object.values(RolePermissions));
        }
    }
];

import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: Show role',
        async test() {
            const token = await TestFactory.createAdminToken();

            const role = await TestFactory.createRole();

            const { body } = await supertest(global.provider.HttpServer)
                .get(`/admin-api/v1/roles/${role.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(role.id);
        }
    },
    {
        title : 'Admin: Show not existing role',
        async test() {
            const token = await TestFactory.createAdminToken();

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/roles/1')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.NOT_FOUND);

            expect(body).toEqual({ code: 'ROLE_NOT_FOUND' });
        }
    }
];

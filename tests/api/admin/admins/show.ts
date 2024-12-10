import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: Show admin',
        async test() {
            const token = await TestFactory.createAdminToken();

            const admin = await TestFactory.createAdmin();

            const { body } = await supertest(global.provider.HttpServer)
                .get(`/admin-api/v1/admins/${admin.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(admin.id);
        }
    }
];

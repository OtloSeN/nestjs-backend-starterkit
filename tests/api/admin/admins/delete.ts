import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: Delete admin',
        async test() {
            const token = await TestFactory.createAdminToken();

            const admin = await TestFactory.createAdmin();

            const { body } = await supertest(global.provider.HttpServer)
                .delete(`/admin-api/v1/admins/${admin.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(admin.id);
        }
    },
    {
        title : 'Admin: Delete admin himself',
        async test() {
            const admin = await TestFactory.createAdmin();
            const token = await TestFactory.createAdminToken(admin);

            const { body } = await supertest(global.provider.HttpServer)
                .delete(`/admin-api/v1/admins/${admin.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'CANNOT_DELETE_YOURSELF' });
        }
    }
];

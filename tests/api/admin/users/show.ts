import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: Show user',
        async test() {
            const token = await TestFactory.createAdminToken();

            const user = await TestFactory.createUser();

            const { body } = await supertest(global.provider.HttpServer)
                .get(`/admin-api/v1/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(user.id);
        }
    }
];

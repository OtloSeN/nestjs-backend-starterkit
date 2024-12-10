/* eslint-disable more/no-hardcoded-configuration-data */
import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: list sers',
        async test() {
            const token = await TestFactory.createAdminToken();

            const [ firstUser ] = await Promise.all([
                TestFactory.createUser({ email: 'email1@mail.com' }),
                TestFactory.createUser({ email: 'email2@mail.com' })
            ]);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/users')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    search : '1'
                })
                .expect(HttpStatus.OK);

            expect(body.meta.totalCount).toEqual(1);
            expect(body.data.length).toEqual(1);
            expect(body.data[0].id).toEqual(firstUser.id);
        }
    }
];

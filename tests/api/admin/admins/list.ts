/* eslint-disable more/no-hardcoded-configuration-data */
import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: list admins',
        async test() {
            const token = await TestFactory.createAdminToken();

            const [ firstAdmin ] = await Promise.all([
                TestFactory.createAdmin({ email: 'admin1@mail.com' }),
                TestFactory.createAdmin({ email: 'admin2@mail.com' })
            ]);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/admins')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    search : '1'
                })
                .expect(HttpStatus.OK);

            expect(body.meta.totalCount).toEqual(1);
            expect(body.data.length).toEqual(1);
            expect(body.data[0].id).toEqual(firstAdmin.id);
        }
    }
];

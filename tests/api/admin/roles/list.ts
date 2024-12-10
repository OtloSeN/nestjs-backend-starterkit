import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Admin: list roles',
        async test() {
            const token = await TestFactory.createAdminToken();

            const [ firstRole ] = await Promise.all([
                TestFactory.createRole({ name: 'Role 1' }),
                TestFactory.createRole({ name: 'Role 2' })
            ]);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/roles')
                .set('Authorization', `Bearer ${token}`)
                .query({
                    search : '1'
                })
                .expect(HttpStatus.OK);

            expect(body.meta.totalCount).toEqual(1);
            expect(body.data.length).toEqual(1);
            expect(body.data[0].id).toEqual(firstRole.id);
        }
    }
];

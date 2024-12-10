import supertest        from 'supertest';
import { HttpStatus }   from '@nestjs/common';
import TestFactory      from 'tests/TestFactory';
import { UserStatuses } from '@domainModels/User';

export default [
    {
        title : 'Admin: Update user',
        async test() {
            const token = await TestFactory.createAdminToken();

            const user = await TestFactory.createUser({
                status : UserStatuses.ACTIVE
            });

            const payload = {
                status : UserStatuses.BLOCKED
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch(`/admin-api/v1/users/${user.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(user.id);
            expect(body.status).not.toEqual(user.status);
            expect(body.status).toEqual(payload.status);
        }
    }
];

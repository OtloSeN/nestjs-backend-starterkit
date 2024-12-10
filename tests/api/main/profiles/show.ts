import supertest        from 'supertest';
import { HttpStatus }   from '@nestjs/common';
import TestFactory      from 'tests/TestFactory';
import { UserStatuses } from '@domainModels/User';

export default [
    {
        title : 'Main: Show profile',
        async test() {
            const user = await TestFactory.createUser();
            const token = await TestFactory.createUserToken(user);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(user.id);
        }
    },
    {
        title : 'Main: Show profile without token',
        async test() {
            const { body } = await supertest(global.provider.HttpServer)
                .get('/api/v1/profiles')
                .expect(HttpStatus.UNAUTHORIZED);

            expect(body).toEqual({
                message    : 'Unauthorized',
                statusCode : 401
            });
        }
    },
    {
        title : 'Main: Show profile with invalid token',
        async test() {
            const token = await TestFactory.createUserToken(undefined, 'WRONG_SECRET');

            const { body } = await supertest(global.provider.HttpServer)
                .get('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'WRONG_TOKEN' });
        }
    },
    {
        title : 'Main: Show BLOCKED profile',
        async test() {
            const user = await TestFactory.createUser({
                status : UserStatuses.BLOCKED
            });
            const token = await TestFactory.createUserToken(user);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'WRONG_USER_STATUS' });
        }
    }
];

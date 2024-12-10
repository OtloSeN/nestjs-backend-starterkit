import supertest          from 'supertest';
import jwt                from 'jsonwebtoken';
import { HttpStatus }     from '@nestjs/common';
import TestFactory        from 'tests/TestFactory';
import { faker }          from '@faker-js/faker';
import addConfig          from 'configs/appConfig';
import { UserSessionDto } from '@common/dto';
import { UserStatuses }   from '@domainModels/User';

export default [
    {
        title : 'Main: Create user session',
        async test() {
            const password = faker.internet.password();

            const user = await TestFactory.createUser({
                password
            });

            const payload = {
                email : user.email,
                password
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.CREATED);

            expect(body.accessToken).toBeTruthy();

            const tokenPayload = jwt.verify(body.accessToken, addConfig.session.secret) as UserSessionDto;

            expect(tokenPayload.userId).toEqual(user.id);
        }
    },
    {
        title : 'Main: Create user session with not existing email',
        async test() {
            const payload = {
                email    : faker.internet.email(),
                password : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'EMAIL_OR_PASSWORD_WRONG' });
        }
    },
    {
        title : 'Main: Create user session with wrong password',
        async test() {
            const user = await TestFactory.createUser();

            const payload = {
                email    : user.email,
                password : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'EMAIL_OR_PASSWORD_WRONG' });
        }
    },
    {
        title : 'Main: Create user session for BLOCKED user',
        async test() {
            const password = faker.internet.password();

            const user = await TestFactory.createUser({
                status : UserStatuses.BLOCKED,
                password
            });

            const payload = {
                email : user.email,
                password
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'WRONG_USER_STATUS' });
        }
    }
];

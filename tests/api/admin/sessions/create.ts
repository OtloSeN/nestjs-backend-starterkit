import supertest           from 'supertest';
import jwt                 from 'jsonwebtoken';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { faker }           from '@faker-js/faker';
import addConfig           from 'configs/appConfig';
import { AdminSessionDto } from '@common/dto';

export default [
    {
        title : 'Admin: Create admin session',
        async test() {
            const password = faker.internet.password();

            const admin = await TestFactory.createAdmin({ password });

            const payload = {
                email : admin.email,
                password
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.CREATED);

            expect(body.accessToken).toBeTruthy();

            const tokenPayload = jwt.verify(body.accessToken, addConfig.session.secret) as AdminSessionDto;

            expect(tokenPayload.adminId).toEqual(admin.id);
        }
    },
    {
        title : 'Admin: Create admin session with not existing email',
        async test() {
            const payload = {
                // eslint-disable-next-line more/no-hardcoded-configuration-data
                email    : 'admin.email@mail.com',
                password : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'EMAIL_OR_PASSWORD_WRONG' });
        }
    },
    {
        title : 'Admin: Create admin session with wrong password',
        async test() {
            const admin = await TestFactory.createAdmin();

            const payload = {
                email    : admin.email,
                password : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/sessions')
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'EMAIL_OR_PASSWORD_WRONG' });
        }
    }
];

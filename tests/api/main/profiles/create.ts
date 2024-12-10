import fs             from 'fs';
import path           from 'path';
import { faker }      from '@faker-js/faker';
import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Main: Create profile',
        async test() {
            const payload = {
                email     : faker.internet.email(),
                firstName : faker.person.firstName(),
                lastName  : faker.person.lastName(),
                password  : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/profiles')
                .field('email', payload.email)
                .field('firstName', payload.firstName)
                .field('lastName', payload.lastName)
                .field('password', payload.password)
                .field('avatar', fs.createReadStream(path.resolve('./tests/fixtures/image.png')))
                .expect(HttpStatus.CREATED);

            expect(body.email).toEqual(payload.email);
            expect(body.firstName).toEqual(payload.firstName);
            expect(body.lastName).toEqual(payload.lastName);
        }
    },
    {
        title : 'Main: Create profile with not unique email',
        async test() {
            const user = await TestFactory.createUser();

            const payload = {
                email     : user.email,
                firstName : faker.person.firstName(),
                lastName  : faker.person.lastName(),
                password  : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/profiles')
                .field('email', payload.email)
                .field('firstName', payload.firstName)
                .field('lastName', payload.lastName)
                .field('password', payload.password)
                .field('avatar', fs.createReadStream(path.resolve('./tests/fixtures/image.png')))
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'USER_NOT_UNIQUE' });
        }
    }
];

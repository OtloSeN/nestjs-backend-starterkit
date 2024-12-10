import fs             from 'fs';
import path           from 'path';
import { faker }      from '@faker-js/faker';
import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import User           from '@domainModels/User';

export default [
    {
        title : 'Main: Update profile',
        async test() {
            const oldPassword = faker.internet.password();

            const user = await TestFactory.createUser({
                password : oldPassword
            });
            const token = await TestFactory.createUserToken(user);

            const payload = {
                firstName : faker.person.firstName(),
                lastName  : faker.person.lastName(),
                oldPassword,
                password  : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .field('firstName', payload.firstName)
                .field('lastName', payload.lastName)
                .field('oldPassword', payload.oldPassword)
                .field('password', payload.password)
                .field('avatar', fs.createReadStream(path.resolve('./tests/fixtures/image.png')))
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(user.id);
            expect(body.firstName).toEqual(payload.firstName);
            expect(body.lastName).toEqual(payload.lastName);

            const userAfterUpdate = await User.findOneOrFail({
                where : { id: user.id }
            });

            expect(await userAfterUpdate.checkPassword(payload.oldPassword)).toBeFalsy();
            expect(await userAfterUpdate.checkPassword(payload.password)).toBeTruthy();
        }
    },
    {
        title : 'Main: Update profile with wrong old password',
        async test() {
            const token = await TestFactory.createUserToken();

            const payload = {
                // eslint-disable-next-line more/no-hardcoded-password
                oldPassword : 'WRONG_PASSWORD',
                password    : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .field('oldPassword', payload.oldPassword)
                .field('password', payload.password)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'WRONG_OLD_PASSWORD' });
        }
    }
];

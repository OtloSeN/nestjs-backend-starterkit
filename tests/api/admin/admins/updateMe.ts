import supertest           from 'supertest';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { RolePermissions } from '@domainModels/Role';
import { faker }           from '@faker-js/faker';

export default [
    {
        title : 'Admin: Show admin himself',
        async test() {
            const role = await TestFactory.createRole({
                permissions : [ RolePermissions.USER_MANAGEMENT ]
            });

            const password = faker.internet.password();

            const admin = await TestFactory.createAdmin({
                roleId : role.id,
                password
            });
            const token = await TestFactory.createAdminToken(admin);

            const payload = {
                firstName   : faker.person.firstName(),
                lastName    : faker.person.lastName(),
                oldPassword : password,
                password    : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch('/admin-api/v1/admins/me')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(admin.id);
            expect(body.firstName).toEqual(payload.firstName);
            expect(body.lastName).toEqual(payload.lastName);

            await admin.reload();

            expect(await admin.checkPassword(payload.oldPassword)).toBeFalsy();
            expect(await admin.checkPassword(payload.password)).toBeTruthy();
        }
    },
    {
        title : 'Admin: Show admin himself with wrong old password',
        async test() {
            const role = await TestFactory.createRole({
                permissions : [ RolePermissions.USER_MANAGEMENT ]
            });

            const admin = await TestFactory.createAdmin({
                roleId : role.id
            });
            const token = await TestFactory.createAdminToken(admin);

            const payload = {
                firstName   : faker.person.firstName(),
                lastName    : faker.person.lastName(),
                oldPassword : faker.internet.password(),
                password    : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch('/admin-api/v1/admins/me')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'WRONG_OLD_PASSWORD' });
        }
    }
];

import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import { faker }      from '@faker-js/faker';

export default [
    {
        title : 'Admin: Update admin',
        async test() {
            const token = await TestFactory.createAdminToken();

            const admin = await TestFactory.createAdmin();

            const role = await TestFactory.createRole();

            const payload = {
                roleId    : role.id,
                firstName : faker.person.firstName(),
                lastName  : faker.person.lastName(),
                password  : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .patch(`/admin-api/v1/admins/${admin.id}`)
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(admin.id);
            expect(body.roleId).toEqual(payload.roleId);
            expect(body.firstName).toEqual(payload.firstName);
            expect(body.lastName).toEqual(payload.lastName);

            await admin.reload();

            expect(await admin.checkPassword(payload.password)).toBeTruthy();
        }
    }
];

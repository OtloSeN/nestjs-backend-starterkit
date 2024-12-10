import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import { faker }      from '@faker-js/faker';
import Admin          from '@domainModels/Admin';

export default [
    {
        title : 'Admin: Create admin',
        async test() {
            const token = await TestFactory.createAdminToken();

            const role = await TestFactory.createRole();

            const payload = {
                roleId    : role.id,
                email     : faker.internet.email(),
                firstName : faker.person.firstName(),
                lastName  : faker.person.lastName(),
                password  : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/admins')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.CREATED);

            expect(body.roleId).toEqual(payload.roleId);
            expect(body.email).toEqual(payload.email);
            expect(body.firstName).toEqual(payload.firstName);
            expect(body.lastName).toEqual(payload.lastName);

            const admin = await Admin.findOneOrFail({
                where : { id: body.id }
            });

            expect(await admin.checkPassword(payload.password)).toBeTruthy();
        }
    }
];

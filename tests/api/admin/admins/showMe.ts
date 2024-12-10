import supertest           from 'supertest';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { RolePermissions } from '@domainModels/Role';

export default [
    {
        title : 'Admin: Show admin himself',
        async test() {
            const role = await TestFactory.createRole({
                permissions : [ RolePermissions.USER_MANAGEMENT ]
            });
            const admin = await TestFactory.createAdmin({
                roleId : role.id
            });
            const token = await TestFactory.createAdminToken(admin);

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/admins/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(admin.id);
        }
    },
    {
        title : 'Admin: Show admin himself without token',
        async test() {
            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/admins/me')
                .expect(HttpStatus.UNAUTHORIZED);

            expect(body).toEqual({
                message    : 'Unauthorized',
                statusCode : 401
            });
        }
    },
    {
        title : 'Admin: Show admin himself with invalid token',
        async test() {
            const token = await TestFactory.createAdminToken(undefined, 'WRONG_SECRET');

            const { body } = await supertest(global.provider.HttpServer)
                .get('/admin-api/v1/admins/me')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'WRONG_TOKEN' });
        }
    }
];

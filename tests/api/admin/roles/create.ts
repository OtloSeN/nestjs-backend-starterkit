/* eslint-disable more/no-hardcoded-configuration-data */
import supertest           from 'supertest';
import { HttpStatus }      from '@nestjs/common';
import TestFactory         from 'tests/TestFactory';
import { faker }           from '@faker-js/faker';
import { RolePermissions } from '@domainModels/Role';

export default [
    {
        title : 'Admin: Create role',
        async test() {
            const token = await TestFactory.createAdminToken();

            const payload = {
                name        : faker.lorem.word(),
                permissions : [ RolePermissions.ADMIN_MANAGEMENT ]
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/roles')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.CREATED);

            expect(body.name).toEqual(payload.name);
            expect(body.permissions.length).toEqual(1);
            expect(body.permissions[0]).toEqual(RolePermissions.ADMIN_MANAGEMENT);
        }
    },
    {
        title : 'Admin: Create role without permissions',
        async test() {
            const role = await TestFactory.createRole({
                permissions : [ RolePermissions.ADMIN_MANAGEMENT ]
            });

            const admin = await TestFactory.createAdmin({ roleId: role.id });

            const token = await TestFactory.createAdminToken(admin);

            const payload = {
                name        : faker.lorem.word(),
                permissions : [ RolePermissions.ADMIN_MANAGEMENT ]
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/roles')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'PERMISSION_DENIED' });
        }
    },
    {
        title : 'Admin: Create role with invalid data',
        async test() {
            const token = await TestFactory.createAdminToken();

            const payload = {
                name        : '',
                permissions : [ 'WRONG_PERMISSION' ]
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/admin-api/v1/roles')
                .set('Authorization', `Bearer ${token}`)
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({
                'code'    : 'FORMAT_ERROR',
                'details' : [
                    {
                        'path' : [
                            'name'
                        ],
                        'type' : 'string.empty'
                    },
                    {
                        'path' : [
                            'permissions',
                            0
                        ],
                        'type' : 'any.only'
                    },
                    {
                        'path' : [
                            'permissions'
                        ],
                        'type' : 'array.includesRequiredUnknowns'
                    }
                ]
            });
        }
    }
];

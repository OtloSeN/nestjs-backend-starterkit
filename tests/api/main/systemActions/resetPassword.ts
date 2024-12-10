import supertest                           from 'supertest';
import { HttpStatus }                      from '@nestjs/common';
import TestFactory                         from 'tests/TestFactory';
import SystemAction, { SystemActionTypes } from '@domainModels/SystemAction';
import { UserStatuses }                    from '@domainModels/User';

export default [
    {
        title : 'Main: Create reset password action',
        async test() {
            const user = await TestFactory.createUser();

            const payload = {
                email : user.email
            };

            await supertest(global.provider.HttpServer)
                .post('/api/v1/system-actions/password-reset')
                .send(payload)
                .expect(HttpStatus.CREATED);

            const systemAction = await SystemAction.findOne({
                where : {
                    userId : user.id,
                    type   : SystemActionTypes.PASSWORD_RESET
                }
            });

            expect(systemAction).toBeTruthy();
        }
    },
    {
        title : 'Main: Create reset password action for blocked user',
        async test() {
            const user = await TestFactory.createUser({
                status : UserStatuses.BLOCKED
            });

            const payload = {
                email : user.email
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/system-actions/password-reset')
                .send(payload)
                .expect(HttpStatus.FORBIDDEN);

            expect(body).toEqual({ code: 'WRONG_USER_STATUS' });
        }
    }
];

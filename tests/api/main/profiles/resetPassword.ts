import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import SystemAction   from '@domainModels/SystemAction';
import { faker }      from '@faker-js/faker';
import { DateTime }   from 'luxon';

export default [
    {
        title : 'Main: Reset profile password',
        async test() {
            const user = await TestFactory.createUser();
            const action = await SystemAction.createPasswordResetAction(user.id);

            const payload = {
                actionId : action.id,
                password : faker.internet.password()
            };

            await supertest(global.provider.HttpServer)
                .post('/api/v1/profiles/reset-password')
                .send(payload)
                .expect(HttpStatus.CREATED);

            await user.reload();

            expect(await user.checkPassword(payload.password)).toBeTruthy();
        }
    },
    {
        title : 'Main: Reset profile password with expired action',
        async test() {
            const user = await TestFactory.createUser();
            const action = await SystemAction.createPasswordResetAction(user.id);

            await action.update({
                expiresAt : DateTime.now().minus({ minute: 1 }).toJSDate()
            });

            const payload = {
                actionId : action.id,
                password : faker.internet.password()
            };

            const { body } = await supertest(global.provider.HttpServer)
                .post('/api/v1/profiles/reset-password')
                .send(payload)
                .expect(HttpStatus.BAD_REQUEST);

            expect(body).toEqual({ code: 'SYSTEM_ACTION_EXPIRED' });
        }
    }
];

import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';
import SystemAction   from '@domainModels/SystemAction';

export default [
    {
        title : 'Main: Show system action',
        async test() {
            const user = await TestFactory.createUser();
            const action = await SystemAction.createPasswordResetAction(user.id);

            const { body } = await supertest(global.provider.HttpServer)
                .get(`/api/v1/system-actions/${action.id}`)
                .expect(HttpStatus.OK);

            expect(body.id).toEqual(action.id);
        }
    }
];

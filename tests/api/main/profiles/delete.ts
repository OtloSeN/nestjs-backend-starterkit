import supertest      from 'supertest';
import { HttpStatus } from '@nestjs/common';
import TestFactory    from 'tests/TestFactory';

export default [
    {
        title : 'Main: Delete profile',
        async test() {
            const user = await TestFactory.createUser();
            const token = await TestFactory.createUserToken(user);

            await supertest(global.provider.HttpServer)
                .delete('/api/v1/profiles')
                .set('Authorization', `Bearer ${token}`)
                .expect(HttpStatus.OK);
        }
    }
];

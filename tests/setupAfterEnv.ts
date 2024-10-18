import { TransactionalTestContext } from 'typeorm-transactional-tests';
import dataSource                   from '../src/domain/dataSource';

let transactionalContext: TransactionalTestContext;

global.beforeAll(async () => {
    if (!dataSource.isInitialized) {
        await dataSource.initialize();
    }
});

global.afterAll(async () => {
    await dataSource.destroy();
});

global.beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
});

global.afterEach(async () => {
    await transactionalContext.finish();
});

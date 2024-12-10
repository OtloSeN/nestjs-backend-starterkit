import dataSource                   from 'src/domain/dataSource';
import { TransactionalTestContext } from 'typeorm-transactional-tests';
import TestProvider                 from '../TestProvider';
import mainApiTests                 from './main';
import adminApiTests                from './admin';

let transactionalContext: TransactionalTestContext;

beforeAll(async () => {
    await dataSource.initialize();

    global.provider = await TestProvider.init();
});

afterAll(async () => {
    await dataSource.destroy();
});

beforeEach(async () => {
    transactionalContext = new TransactionalTestContext(dataSource);
    await transactionalContext.start();
});

afterEach(async () => {
    await transactionalContext.finish();
});

let tests = [
    ...mainApiTests,
    ...adminApiTests
] as ICustomTest[];

const testsToRun = tests.filter(test => test.only);

if (testsToRun.length) {
    tests = testsToRun;
}

tests.forEach(async ({ title, test: testCallback }) => {
    try {
        test(title, testCallback);
    } catch (error) {
        await transactionalContext.finish();
    }
});

interface ICustomTest {
    only? : boolean;
    title : string;
    test  : () => Promise<void>
}

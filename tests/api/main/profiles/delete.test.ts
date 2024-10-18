import TestProvider from 'tests/TestProvider';

describe('Main: profile deleting', () => {
    let provider: TestProvider;

    beforeAll(async () => {
        provider = await TestProvider.init();
    });

    afterAll(async () => {
        provider.shutdown();
    });

    test('Delete profile', async () => {

    });
});

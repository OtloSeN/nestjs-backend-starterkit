import { AsyncLocalStorage } from 'async_hooks';

interface IAslStore {
    traceId : string;
    context : string;
}

export type TAsyncLocalStorage = AsyncLocalStorage<IAslStore>;

const asyncLocalStorage = new AsyncLocalStorage<IAslStore>();

export default asyncLocalStorage;

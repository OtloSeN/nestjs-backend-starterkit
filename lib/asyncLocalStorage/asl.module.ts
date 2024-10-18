import { Global, Module } from '@nestjs/common';
import asyncLocalStorage  from './asyncLocalStorage';

export const ASL_PROVIDER_KEY = 'ASL_PROVIDER';

const provider = {
    provide  : ASL_PROVIDER_KEY,
    useValue : asyncLocalStorage
};

@Global()
@Module({
    providers : [ provider ],
    exports   : [ provider ]
})
export default class AsyncLocalStorageModule {}

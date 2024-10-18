import { Global, Module }              from '@nestjs/common';
import config, { CONFIG_PROVIDER_KEY } from './appConfig';

const configProivder = {
    provide  : CONFIG_PROVIDER_KEY,
    useValue : config
};

@Global()
@Module({
    providers : [ configProivder ],
    exports   : [ configProivder ]
})
export default class ConfigModule {}

import { Test }                      from '@nestjs/testing';
import appConfig                     from 'configs/appConfig';
import {
    StorageDriver,
    addTransactionalDataSource,
    initializeTransactionalContext
} from 'typeorm-transactional';
import TempFilesInterceptor from '@common/interceptors/tempFiles.interceptor';
import AppProvider          from '../src/AppProvider';
import AppModule            from '../src/app.module';

export default class TestProvider extends AppProvider {
    constructor() {
        super(appConfig);
    }

    get HttpServer() {
        return this.nestApplication.getHttpServer();
    }

    static async init() {
        const provider = new this();

        await provider.initApp();

        return provider;
    }

    protected async initNestApplication() {
        const moduleRef = await Test.createTestingModule({
            imports : [ AppModule ]
        }).compile();

        this.nestApplication = moduleRef.createNestApplication({
            logger  : this.logger,
            rawBody : true
        });

        this.nestApplication.useGlobalInterceptors(new TempFilesInterceptor(this.logger));

        await this.nestApplication.init();
    }

    protected initTransactionalContext() {
        initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });

        addTransactionalDataSource(this.dataSource);
    }

    async initApp() {
        this.initTransactionalContext();
        this.initLogger();
        await this.initNestApplication();
        this.subscribeToSystemSignals();
        this.initS3Clients();
    }

    async shutdown() {
        await this.nestApplication.close();
    }
}

import { Server, AddressInfo }                                                       from 'net';
import { StorageDriver, addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { NestFactory }                                                               from '@nestjs/core';
import IAppConfig                                                                    from 'configs/interfaces/IAppConfig';
import { INestApplication }                                                          from '@nestjs/common';
import LoggerFactory                                                                 from 'lib/logger/LoggerFactory';
import asyncLocalStorage, { TAsyncLocalStorage }                                     from 'lib/asyncLocalStorage/asyncLocalStorage';
import LoggerService                                                                 from 'lib/logger/logger.service';
import { DataSource }                                                                from 'typeorm';
import { DocumentBuilder, SwaggerModule }                                            from '@nestjs/swagger';
import TempFilesInterceptor                                                          from '@common/interceptors/tempFiles.interceptor';
import S3Provider                                                                    from 'lib/s3/S3Provider';
import AppModule                                                                     from './app.module';
import dataSource                                                                    from './domain/dataSource';
import MainModule                                                                    from './api/rest-api/main/main.module';
import AdminModule                                                                   from './api/rest-api/admin/admin.module';

export default class AppProvider {
    protected readonly config : IAppConfig;

    protected nestApplication : INestApplication;

    protected logger : LoggerService;

    protected server : Server;

    protected readonly asl : TAsyncLocalStorage = asyncLocalStorage;

    protected readonly dataSource : DataSource = dataSource;

    constructor(config: IAppConfig) {
        this.config = config;
    }

    async initApp() {
        this.initTransactionalContext();
        this.initLogger();
        await this.initNestApplication();
        await this.initModels();
        this.initS3Clients();
        this.subscribeToSystemSignals();
        this.setupSwaggerApiDocs();
    }

    protected initLogger() {
        const winstonLogger = LoggerFactory.createLogger({
            asl : this.asl,
            ...this.config.logger
        });

        this.logger = new LoggerService(winstonLogger);
    }

    protected initTransactionalContext() {
        initializeTransactionalContext({ storageDriver: StorageDriver.AUTO });
    }

    protected async initNestApplication() {
        this.nestApplication = await NestFactory.create(AppModule, {
            logger  : this.logger,
            rawBody : true
        });

        this.nestApplication.useGlobalInterceptors(new TempFilesInterceptor(this.logger));
    }

    protected setupSwaggerApiDocs() {
        const mainSwaggerConfig = new DocumentBuilder()
            .setTitle('Starter Kit Main API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const mainSwaggerDocument = SwaggerModule.createDocument(this.nestApplication, mainSwaggerConfig, {
            include        : [ MainModule ],
            deepScanRoutes : true
        });

        SwaggerModule.setup('main-api-docs', this.nestApplication, mainSwaggerDocument);

        const adminSwaggerConfig = new DocumentBuilder()
            .setTitle('Starter Kit Admin API')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const adminSwaggerDocument = SwaggerModule.createDocument(this.nestApplication, adminSwaggerConfig, {
            include        : [ AdminModule ],
            deepScanRoutes : true
        });

        SwaggerModule.setup('admin-api-docs', this.nestApplication, adminSwaggerDocument);
    }

    protected async initModels() {
        addTransactionalDataSource(this.dataSource);

        await this.dataSource.initialize();
    }

    protected initS3Clients() {
        S3Provider.init({
            accessKeyId        : this.config.aws.accessKeyId,
            secretAccessKey    : this.config.aws.secretAccessKey,
            region             : this.config.aws.region,
            client             : this.config.aws.s3.client,
            host               : this.config.aws.s3.host,
            bucket             : this.config.aws.s3.bucket,
            signedUrlExpiresIn : this.config.aws.s3.signedUrlExpiresIn
        });
    }

    protected subscribeToSystemSignals() {
        process.on('SIGTERM', async () => {
            this.logger.info('SIGTERM signal catched');

            await this.shutdown();
        });

        process.on('SIGINT', async () => {
            this.logger.info('SIGINT signal catched');

            await this.shutdown();
        });

        process.on('unhandledRejection', error => {
            this.logger.error({
                type : 'UnhandledRejection',
                error
            });
        });

        process.on('uncaughtException', error => {
            this.logger.error({
                type : 'UnhandledRejection',
                error
            });
        });
    }

    async start() {
        this.server = await this.nestApplication.listen(this.config.port);

        const port = (this.server.address() as AddressInfo).port;

        this.logger.info(`App listens on port ${port}`);
    }

    async shutdown() {
        await this.closeServerAsync();
        await this.nestApplication.close();
        await this.dataSource.destroy();

        this.logger.info('Exit');

        process.exit(0);
    }

    private async closeServerAsync() {
        return new Promise<Server>((resolve, reject) => {
            this.server.close(err => {
                if (err) reject(err);

                resolve(this.server);
            });
        });
    }
}


import { ITransportOptions, TTransport } from 'lib/email/interfaces/IEmailSender';
import { ILoggerParams }                 from 'lib/logger/interfaces/ILoggerFactory';
import { TS3Clients }                    from 'lib/s3/S3Provider';

type DatabaseDialect = 'mysql' | 'sqlite' | 'postgres';

type DatabaseParams = {
    username : string;
    password : string;
    database : string;
    dialect  : DatabaseDialect;
    host     : string;
    port     : number;
};

export default interface IAppConfig {
    hostUrl  : string;
    uiUrl    : string;
    adminUrl : string;
    port     : number;
    db       : DatabaseParams;
    logger   : Pick<ILoggerParams, 'maxLevel' | 'format' | 'transports'>;
    session: {
        secret : string;
        maxAge : number;
    };
    email: {
        transport        : TTransport;
        transportOptions : ITransportOptions;
        from             : string;
    };
    aws: {
        accessKeyId     : string;
        secretAccessKey : string;
        region          : string;
        s3: {
            host               : string;
            client             : TS3Clients;
            bucket             : string;
            signedUrlExpiresIn : number;
        }
    };
}

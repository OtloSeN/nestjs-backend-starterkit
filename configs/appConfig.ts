import 'dotenv/config';
import Joi        from 'joi';
import IAppConfig from './interfaces/IAppConfig';

export const CONFIG_PROVIDER_KEY = 'CONFIG_PROVIDER';

const validationSchema = Joi.object<IAppConfig>({
    hostUrl  : Joi.string().uri().required(),
    uiUrl    : Joi.string().uri().required(),
    adminUrl : Joi.string().uri().required(),
    port     : Joi.number().port().required(),
    db       : Joi.object({
        username : Joi.string().required(),
        password : Joi.string().required(),
        database : Joi.string().required(),
        dialect  : Joi.string().valid('mysql', 'sqlite', 'postgres').required(),
        host     : Joi.string().hostname().required(),
        port     : Joi.number().positive().required()
    }).required(),
    logger : Joi.object({
        format     : Joi.string().valid('JSON', 'STRING').required(),
        maxLevel   : Joi.string().valid('debug', 'info', 'warn', 'error').required(),
        transports : Joi.array().min(1).items(
            Joi.object({
                type     : Joi.string().valid('console').required(),
                maxLevel : Joi.link('#logger.maxLevel')
            })
        ).required()
    }).required(),
    session : Joi.object({
        secret : Joi.string().required(),
        maxAge : Joi.number().integer().positive().required()
    }).required(),
    email : Joi.object({
        transport        : Joi.string().valid('SMTP', 'TEST').required(),
        transportOptions : Joi.object({
            host   : Joi.string().hostname().required(),
            port   : Joi.number().port().required(),
            secure : Joi.boolean().required(),
            auth   : {
                user : Joi.string().required(),
                pass : Joi.string().required()
            }
        }).required(),
        from : Joi.string().required()
    }).required(),
    aws : Joi.object({
        accessKeyId     : Joi.string().required(),
        secretAccessKey : Joi.string().required(),
        region          : Joi.string().required(),
        s3              : Joi.object({
            host               : Joi.string().uri().required(),
            client             : Joi.string().valid('S3', 'TEST', 'MINIO').required(),
            bucket             : Joi.string().required(),
            signedUrlExpiresIn : Joi.number().integer().positive().required()
        }).required()
    }).required()
}).id('schema');

const { value: config, error } = validationSchema.validate({
    hostUrl  : process.env.HOST_URL,
    uiUrl    : process.env.UI_URL,
    adminUrl : process.env.ADMIN_URL,
    port     : process.env.PORT,
    db       : process.env.NODE_ENV === 'test'
        ? {
            username : process.env.TEST_DB_USERNAME,
            password : process.env.TEST_DB_PASSWORD,
            database : process.env.TEST_DB_DATABASE,
            dialect  : process.env.TEST_DB_DIALECT,
            host     : process.env.TEST_DB_HOST,
            port     : process.env.TEST_DB_PORT
        }
        : {
            username : process.env.DB_USERNAME,
            password : process.env.DB_PASSWORD,
            database : process.env.DB_DATABASE,
            dialect  : process.env.DB_DIALECT,
            host     : process.env.DB_HOST,
            port     : process.env.DB_PORT
        },
    logger : {
        format     : process.env.LOGGER_FORMAT,
        maxLevel   : process.env.NODE_ENV === 'test' ? 'error' : process.env.LOGGER_MAX_LEVEL,
        transports : [
            {
                type     : 'console',
                maxLevel : process.env.NODE_ENV === 'test' ? 'error' : process.env.LOGGER_MAX_LEVEL
            }
        ]
    },
    session : {
        secret : process.env.SECRET,
        maxAge : process.env.SESSION_AGE
    },
    email : {
        transport        : process.env.NODE_ENV === 'test' ? 'TEST' : process.env.MAIL_TRANSPORT,
        transportOptions : {
            host   : process.env.MAIL_HOST,
            port   : process.env.MAIL_PORT,
            secure : process.env.MAIL_SECURE,
            auth   : {
                user : process.env.MAIL_AUTH_USER,
                pass : process.env.MAIL_AUTH_PASS
            }
        },
        from : process.env.MAIL_FROM
    },
    aws : {
        accessKeyId     : process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
        region          : process.env.AWS_REGION,
        s3              : {
            host               : process.env.AWS_S3_HOST,
            client             : process.env.NODE_ENV === 'test' ? 'TEST' : process.env.AWS_S3_CLIENT,
            bucket             : process.env.AWS_S3_BUCKET,
            signedUrlExpiresIn : process.env.AWS_S3_SIGNED_URL_EXPIRES_IN
        }
    }
}, {
    abortEarly   : false,
    allowUnknown : true,
    stripUnknown : true
});

if (error) {
    console.error(JSON.stringify(error.details));

    throw error;
}

export default config as IAppConfig;

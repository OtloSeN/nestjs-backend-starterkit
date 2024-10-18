import { S3Client as AwsS3Client, DeleteObjectCommand, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl }                                                                     from '@aws-sdk/s3-request-presigner';
import {
    IS3Client,
    IS3ClientPutObjectParams,
    IS3ClientDeleteObjectParams,
    IS3ClientGetObjectParams,
    IS3ClientGetSignedObjectUrlParams
} from '../interfaces/IS3Client';

export default class S3Client implements IS3Client {
    private readonly bucket : string;

    private readonly signedUrlExpiresIn : number;

    private readonly client : AwsS3Client;

    constructor(args: IS3ClientArgs) {
        this.bucket = args.bucket;
        this.signedUrlExpiresIn = args.signedUrlExpiresIn;

        this.client = new AwsS3Client({
            credentials : {
                accessKeyId     : args.accessKeyId,
                secretAccessKey : args.secretAccessKey
            },
            endpoint : args.host,
            region   : args.region
        });
    }

    putObject({ key, body, contentType }: IS3ClientPutObjectParams) {
        return this.client.send(new PutObjectCommand({
            Bucket      : this.bucket,
            Key         : key,
            Body        : body,
            ContentType : contentType
        }));
    }

    deleteObject({ key }: IS3ClientDeleteObjectParams) {
        return this.client.send(new DeleteObjectCommand({
            Bucket : this.bucket,
            Key    : key
        }));
    }

    getObject({ key }: IS3ClientGetObjectParams) {
        return this.client.send(new GetObjectCommand({
            Bucket : this.bucket,
            Key    : key
        }));
    }

    getSignedObjectUrl(params: IS3ClientGetSignedObjectUrlParams): Promise<string> {
        return getSignedUrl(
            this.client,
            new GetObjectCommand({
                Bucket : this.bucket,
                Key    : params.key
            }),
            {
                expiresIn : this.signedUrlExpiresIn
            }
        );
    }
}

interface IS3ClientArgs {
    accessKeyId        : string;
    secretAccessKey    : string;
    region             : string;
    host?              : string;
    bucket             : string;
    signedUrlExpiresIn : number;
}

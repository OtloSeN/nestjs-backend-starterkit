import { IS3Client } from './interfaces/IS3Client';
import S3Client      from './clients/S3Client';
import S3TestClient  from './clients/S3TestClient';

export type TS3Clients = 'S3' | 'TEST' | 'MINIO';

export default class S3Provider {
    private static s3Client : IS3Client;

    static get client() {
        if (!this.s3Client) throw new Error('Clients are not set');

        return this.s3Client;
    }

    static init(params: IS3ProviderInitParams) {
        if (params.client === 'TEST') {
            this.s3Client = new S3TestClient();
        } else {
            this.s3Client = new S3Client({
                accessKeyId        : params.accessKeyId,
                secretAccessKey    : params.secretAccessKey,
                region             : params.region,
                host               : params.client === 'MINIO' ? params.host : undefined,
                bucket             : params.bucket,
                signedUrlExpiresIn : params.signedUrlExpiresIn
            });
        }
    }
}

interface IS3ProviderInitParams {
    accessKeyId        : string;
    secretAccessKey    : string;
    client             : TS3Clients;
    region             : string;
    host               : string;
    bucket             : string;
    signedUrlExpiresIn : number;
}

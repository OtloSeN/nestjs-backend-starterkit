import { Readable } from 'stream';

export interface IS3Client {
    putObject(params: IS3ClientPutObjectParams);

    deleteObject(params: IS3ClientDeleteObjectParams);

    getObject(params: IS3ClientGetObjectParams);

    getSignedObjectUrl(params: IS3ClientGetSignedObjectUrlParams): Promise<string>
}

export interface IS3ClientPutObjectParams {
    key         : string;
    body        : Buffer | string | Readable;
    contentType : string;
}

export interface IS3ClientDeleteObjectParams {
    key : string;
}

export interface IS3ClientGetObjectParams {
    key : string;
}

export interface IS3ClientGetSignedObjectUrlParams {
    key : string;
}

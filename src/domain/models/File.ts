import fs                                                                             from 'fs';
import S3Provider                                                                     from 'lib/s3/S3Provider';
import { IFileUploadFile, IFileDeleteFile, IFileDownloadFile, IFileGetSignedFileUrl } from './interfaces/IFile';

export default class File {
    static uploadFile({ path, filepath, mimetype }: IFileUploadFile) {
        const readStream = fs.createReadStream(filepath);

        return S3Provider.client.putObject({
            key         : path,
            body        : readStream,
            contentType : mimetype
        });
    }

    static async deleteFile({ path }: IFileDeleteFile) {
        return S3Provider.client.deleteObject({
            key : path
        });
    }

    static async downloadFile({ path }: IFileDownloadFile) {
        return S3Provider.client.getObject({
            key : path
        });
    }

    static getSignedFileUrl({ path }: IFileGetSignedFileUrl) {
        return S3Provider.client.getSignedObjectUrl({
            key : path
        });
    }
}


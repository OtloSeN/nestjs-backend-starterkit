import File      from '@domainModels/File';
import appConfig from 'configs/appConfig';

export function dumpPublicFileUrl(path: string) {
    return `${appConfig.aws.s3.host}/${path}`;
}

export async function dumpSignedFileUrl(path: string) {
    return File.getSignedFileUrl({ path });
}

export interface IFile extends Pick<Express.Multer.File, 'originalname' | 'path' | 'mimetype' | 'size'> {}

export interface IFileUploadFile {
    path     : string;
    filepath : string;
    mimetype : string;
}

export interface IFileDeleteFile {
    path : string;
}

export interface IFileDownloadFile {
    path : string;
}

export interface IFileGetSignedFileUrl {
    path : string;
}

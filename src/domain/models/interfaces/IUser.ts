import { IFile } from './IFile';

export interface IUserRegisterData {
    email     : string;
    firstName : string;
    lastName  : string;
    avatar    : IFile;
    password  : string;
}

export interface IUserUpdateProfileData {
    firstName?   : string;
    lastName?    : string;
    avatar?      : IFile;
    oldPassword? : string;
    password?    : string;
}

import { UserStatuses } from '@domainModels/User';
import { IFile }        from './IFile';

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

export interface IUserUpdateByAdminParams {
    status? : UserStatuses;
}

export interface IUserAuthenticateParams {
    email    : string;
    password : string;
}

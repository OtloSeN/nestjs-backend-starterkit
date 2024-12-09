export interface IAdminRegisterParams {
    roleId    : number;
    email     : string;
    firstName : string;
    lastName  : string;
    password  : string;
}

export interface IAdminAuthenticateParams {
    email    : string;
    password : string;
}

export interface IAdminUpdateMeParams {
    firstName?   : string;
    lastName?    : string;
    password?    : string;
    oldPassword? : string;
}

export interface IAdminUpdateInstanceParams {
    roleId?    : number;
    firstName? : string;
    lastName?  : string;
    password?  : string;
}

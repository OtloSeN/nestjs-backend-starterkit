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

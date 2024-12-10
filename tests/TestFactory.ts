import path                                  from 'path';
import jwt                                   from 'jsonwebtoken';
import { faker }                             from '@faker-js/faker';
import appConfig                             from 'configs/appConfig';
import User, { UserStatuses }                from '@domainModels/User';
import { dumpAdminSession, dumpUserSession } from '@common/dumps';
import Admin                                 from '@domainModels/Admin';
import Role, { RolePermissions }             from '@domainModels/Role';

export default class TestFactory {
    static async createUser(params: ICreateUserParams = {}) {
        const avatarPath = path.resolve('tests/fixtures/image.png');

        const user = await User.register({
            email     : params.email || faker.internet.email(),
            firstName : params.firstName || faker.person.firstName(),
            lastName  : params.lastName || faker.person.lastName(),
            password  : params.password || faker.internet.password(),
            avatar    : {
                originalname : path.basename(avatarPath),
                mimetype     : 'audio/mpeg',
                path         : avatarPath,
                size         : 734000
            }
        });

        return user.update({
            status : params.status
        });
    }

    static async createUserToken(user?: User, secret:string = appConfig.session.secret) {
        const userToLogin = user || (await this.createUser());

        return jwt.sign(
            {
                ...dumpUserSession(userToLogin)
            },
            secret
        );
    }

    static async createRole(data: ICreateRoleParams = {}) {
        return Role.createRole({
            name        : data.name || faker.lorem.word(),
            permissions : data.permissions || Object.values(RolePermissions)
        });
    }

    static async createAdmin(params: ICreateAdminParams = {}) {
        const roleId = params.roleId || (await this.createRole()).id;

        return Admin.register({
            roleId,
            email     : params.email || faker.internet.email(),
            firstName : params.firstName || faker.person.firstName(),
            lastName  : params.lastName || faker.person.lastName(),
            password  : params.password || faker.internet.password()
        });
    }

    static async createAdminToken(admin?: Admin, secret:string = appConfig.session.secret) {
        const adminToLogin = admin || (await this.createAdmin());

        return jwt.sign(
            {
                ...dumpAdminSession(adminToLogin)
            },
            secret
        );
    }
}

interface ICreateUserParams {
    email?     : string;
    firstName? : string;
    lastName?  : string;
    password?  : string;
    status?    : UserStatuses;
}

interface ICreateRoleParams {
    name?        : string;
    permissions? : RolePermissions[];
}

interface ICreateAdminParams {
    roleId?    : number;
    email?     : string;
    firstName? : string;
    lastName?  : string;
    password?  : string;
}

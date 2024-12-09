import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request }                   from 'express';
import { Reflector }                 from '@nestjs/core';
import IsPublic                      from '@common/decorators/isPublic.decorator';
import RequiredAdminPermissions      from '@common/decorators/requiredPermission.decorator';
import { RolePermissions }           from '@domainModels/Role';
import { ForbiddenRequestException } from '@common/exceptions';
import AdminSessionCheck             from './useCases/Check.useCase';

@Injectable()
export default class AdminSessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly adminSessionCheck: AdminSessionCheck
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isPublic(context)) return true;

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const sessionContext = await this.adminSessionCheck.run({ data: { token } });

        this.checkRequiredPermission(context, sessionContext.role.permissions);

        request.sessionContext = sessionContext;

        return true;
    }

    private extractTokenFromRequest(request: Request): string | undefined {
        const [ type, token ] = request.headers.authorization?.split(' ') ?? [];
        const bearerToken = type === 'Bearer' ? token : undefined;

        return bearerToken;
    }

    private isPublic(context: ExecutionContext) {
        let isPublic = this.reflector.get<boolean>(IsPublic, context.getHandler());

        if (isPublic === undefined) {
            isPublic = this.reflector.get<boolean>(IsPublic, context.getClass());
        }

        return !!isPublic;
    }

    private checkRequiredPermission(context: ExecutionContext, adminPermissions: RolePermissions[]) {
        let requiredPermissions = this.reflector.get(RequiredAdminPermissions, context.getHandler());

        if (!requiredPermissions) {
            requiredPermissions = this.reflector.get(RequiredAdminPermissions, context.getClass());
        }


        if (requiredPermissions && !requiredPermissions.every(permission => adminPermissions.includes(permission))) {
            throw new ForbiddenRequestException({ code: 'PERMISSION_DENIED' });
        }
    }
}

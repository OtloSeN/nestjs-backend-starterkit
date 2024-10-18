import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request }       from 'express';
import { Reflector }     from '@nestjs/core';
import IsPublic          from '@common/decorators/isPublic.decorator';
import AdminSessionCheck from './useCases/Check.useCase';

@Injectable()
export default class AdminSessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly adminSessionCheck: AdminSessionCheck
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>(IsPublic, context.getHandler());

        if (isPublic) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const sessionContext = await this.adminSessionCheck.run({ data: { token } });

        request.sessionContext = sessionContext;

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [ type, token ] = request.headers.authorization?.split(' ') ?? [];

        return type === 'Bearer' ? token : undefined;
    }
}

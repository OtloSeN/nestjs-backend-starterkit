import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException
} from '@nestjs/common';
import { Request }                   from 'express';
import { Reflector }                 from '@nestjs/core';
import AllowedUserStatuses           from '@common/decorators/allowedStatuses.decorator';
import IsPublic                      from '@common/decorators/isPublic.decorator';
import { UserStatuses }              from '@domainModels/User';
import { ForbiddenRequestException } from '@common/exceptions';
import SessionCheckUseCase           from './useCases/Check.useCase';

@Injectable()
export default class MainSessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly sessionCheckUseCase: SessionCheckUseCase
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (this.isPublic(context)) return true;

        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromRequest(request);

        if (!token) {
            throw new UnauthorizedException();
        }

        const sessionContext = await this.sessionCheckUseCase.run({ data: { token } });

        this.checkUserStatus(context, sessionContext.status);

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

    private checkUserStatus(context: ExecutionContext, userStatus: UserStatuses) {
        let allowedStatuses = this.reflector.get(AllowedUserStatuses, context.getHandler());

        if (!allowedStatuses) {
            allowedStatuses = this.reflector.get(AllowedUserStatuses, context.getClass());
        }

        if (allowedStatuses && !allowedStatuses.includes(userStatus)) {
            throw new ForbiddenRequestException({ code: 'WRONG_USER_STATUS' });
        }
    }
}

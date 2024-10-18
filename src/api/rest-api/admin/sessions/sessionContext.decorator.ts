import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IAdminSessionContext {
    id    : number,
    email : string
}

export const AdminSessionContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.sessionContext as IAdminSessionContext;
});

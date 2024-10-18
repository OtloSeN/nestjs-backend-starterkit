import { UserStatuses }                           from '@domainModels/User';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface IMainSessionContext {
    userId    : number;
    email     : string;
    status    : UserStatuses;
    createdAt : Date;
}

const MainSessionContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.sessionContext as IMainSessionContext;
});

export default MainSessionContext;

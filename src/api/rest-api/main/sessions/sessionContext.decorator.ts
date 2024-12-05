import { UserSessionDto }                         from '@common/dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const MainSessionContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.sessionContext as UserSessionDto;
});

export default MainSessionContext;

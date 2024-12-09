import { AdminSessionDto }                        from '@common/dto';
import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const AdminSessionContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    return request.sessionContext as AdminSessionDto;
});

export default AdminSessionContext;

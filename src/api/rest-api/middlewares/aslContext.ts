import crypto                                 from 'crypto';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction }    from 'express';
import { ASL_PROVIDER_KEY }                   from 'lib/asyncLocalStorage/asl.module';
import { TAsyncLocalStorage }                 from 'lib/asyncLocalStorage/asyncLocalStorage';

@Injectable()
export default class AslContextMiddleware implements NestMiddleware {
    constructor(
        @Inject(ASL_PROVIDER_KEY)
        private readonly asyncLocalStorage: TAsyncLocalStorage
    ) {}

    use(req: Request, res: Response, next: NextFunction) {
        const traceId = crypto.randomUUID();
        const context = `${req.method} ${req.baseUrl}`;

        this.asyncLocalStorage.run({ traceId, context }, () => {
            next();
        });
    }
}

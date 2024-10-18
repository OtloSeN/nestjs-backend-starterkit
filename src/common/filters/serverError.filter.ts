import LoggerService                           from 'lib/logger/logger.service';
import { Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { BaseExceptionFilter }                 from '@nestjs/core';

@Catch()
export class ServerErrorExceptionFilter extends BaseExceptionFilter {
    constructor(
        private readonly logger: LoggerService
    ) {
        super();
    }

    catch(exception: Error, host: ArgumentsHost) {
        /* istanbul ignore if */
        if (!(exception instanceof HttpException)) {
            const http = host.switchToHttp();

            const req = http.getRequest();

            this.logger.error({
                code    : 'SERVER_ERROR',
                request : {
                    path   : req.path,
                    method : req.method,
                    query  : req.query,
                    body   : req.body
                },
                error : {
                    message : exception.message,
                    stack   : exception.stack
                }
            });
        }

        super.catch(exception, host);
    }
}

import fs                                                             from 'fs/promises';
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { tap, catchError }                                            from 'rxjs/operators';
import LoggerService                                                  from 'lib/logger/logger.service';

@Injectable()
export default class TempFilesInterceptor implements NestInterceptor {
    constructor(
        private readonly logger: LoggerService
    ) {}

    intercept(context: ExecutionContext, next: CallHandler) {
        return next
            .handle()
            .pipe(
                catchError(async error => {
                    await this.cleanTempFiles(context);

                    throw error;
                }),
                tap(async () => {
                    await this.cleanTempFiles(context);
                })
            );
    }

    private cleanTempFiles(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();

        const files: Express.Multer.File[] = req.files || [];

        return Promise.all(files.map(async file => {
            try {
                await fs.access(file.path, fs.constants.F_OK);

                return fs.unlink(file.path);
            } catch (error) {
                this.logger.error(error);
            }
        }));
    }
}

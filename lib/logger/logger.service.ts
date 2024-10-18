import { LoggerService as ILoggerService, Injectable, Scope } from '@nestjs/common';
import { Logger }                                             from 'winston';

@Injectable({
    scope : Scope.TRANSIENT
})
export default class LoggerService implements ILoggerService {
    private context : string;

    private readonly logger : Logger;

    constructor(winstonLogger: Logger) {
        this.logger = winstonLogger;
    }

    debug(message: string | object) {
        this.logger.debug(message as string);
    }

    info(message: string | object) {
        this.logger.info(message as string, { context: this.context });
    }

    warn(message: string | object) {
        this.logger.warn(message as string);
    }

    error(message: string | object) {
        this.logger.error(message as string);
    }

    // For Nest system logs
    log(message: string | object, context?: string) {
        this.context = context;

        this.info(message);
    }
}

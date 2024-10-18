import winston                                            from 'winston';
import fastRedact                                         from 'fast-redact';
import { DateTime }                                       from 'luxon';
import { TAsyncLocalStorage }                             from 'lib/asyncLocalStorage/asyncLocalStorage';
import { IFormatParams, ILoggerParams, ITransportParams } from './interfaces/ILoggerFactory';

export default class LoggerFactory {
    private static get LOG_FORMAT() {
        return {
            STRING : 'STRING',
            JSON   : 'JSON'
        };
    }

    private static get LEVELS() {
        return {
            error : 0,
            warn  : 1,
            info  : 2,
            debug : 3
        };
    }

    private static get COLORS() {
        return {
            error : 'red',
            warn  : 'yellow',
            info  : 'green',
            debug : 'white'
        };
    }

    static createLogger(params: ILoggerParams) {
        winston.addColors(this.COLORS);

        return winston.createLogger({
            silent     : params.silent,
            levels     : this.LEVELS,
            level      : params.maxLevel,
            transports : params.transports.map(this.createTransport),
            format     : this.createFormat({
                format : params.format,
                asl    : params.asl
            })
        });
    }

    private static createTransport({ type, maxLevel }: ITransportParams) {
        const { Console } = winston.transports;

        switch (type) {
            case 'console':
                return new Console({ level: maxLevel });

            default:
                throw new Error('Transport not found');
        }
    }

    private static createFormat(params: IFormatParams) {
        const { combine, timestamp, json } = winston.format;

        const format = params.format === this.LOG_FORMAT.JSON ? json : this.printFormat;

        return combine(
            timestamp({
                format : () => DateTime.utc().toFormat('dd/MM/yyyy HH:mm:ss')

            }),
            this.aslFormat(params.asl),
            this.maskFormat(),
            format()
        );
    }

    private static get aslFormat() {
        return winston.format((info, asl: TAsyncLocalStorage) => {
            if (!asl) return info;

            const aslStore = asl.getStore() || {};

            return {
                ...aslStore,
                ...info
            };
        });
    }

    private static get maskFormat() {
        return winston.format((info) => {
            const redact = fastRedact({
                paths : [
                    'message.request.*.password',
                    'message.request.*.passwordHash',
                    'message.request.*.code'
                ],
                censor    : '**SENSITIVE DATA**',
                serialize : false
            });

            return redact(info);
        });
    }

    private static get printFormat() {
        return () => {
            return winston.format.printf(log => {
                const msg = typeof log.message === 'object' ? JSON.stringify(log.message) : log.message;

                const colorizer = winston.format.colorize();

                return colorizer.colorize(
                    log.level,
                    `[${log.level.toUpperCase()} ${log.timestamp}]`
                        .concat(log.context ? ` ${log.context}` : '')
                        .concat(log.traceId ? ` | TraceID: ${log.traceId}` : '')
                        .concat(` | ${msg}`)
                );
            });
        };
    }
}

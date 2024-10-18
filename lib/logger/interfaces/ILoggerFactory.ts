import { TAsyncLocalStorage } from 'lib/asyncLocalStorage/asyncLocalStorage';

export interface ILoggerParams {
    silent?    : boolean;
    maxLevel   : TLevel,
    format     : TFormat,
    transports : ITransportParams[],
    asl?       : TAsyncLocalStorage
}

export type TLevel = 'debug' | 'info' | 'warn' | 'error';

export type TFormat = 'STRING' | 'JSON';

export interface ITransportParams {
    type     : 'console'
    maxLevel : TLevel
}

export interface IFormatParams {
    format : TFormat;
    asl?   : TAsyncLocalStorage
}

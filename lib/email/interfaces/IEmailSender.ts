import { ITemplateFactoryDefaultData } from './ITemplateFactory';

export interface IEmailSenderArgs {
    transport           : TTransport;
    transportOptions    : ITransportOptions,
    from                : string;
    defaultTemplateData : ITemplateFactoryDefaultData
}

export type TTransport = 'SMTP' | 'TEST';

export interface ITransportOptions {
    host   : string;
    port   : number;
    secure : boolean;
    auth: {
        user : string;
        pass : string;
    }
}

export type TTemplatePayload = IPasswordResetPayload;

export interface IPasswordResetPayload {
    actionId : string;
}

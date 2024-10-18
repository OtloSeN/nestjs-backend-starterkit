import nodemailer, { Transporter }                                           from 'nodemailer';
import stubTransport                                                         from 'nodemailer-stub-transport';
import { IEmailSenderArgs, ITransportOptions, TTemplatePayload, TTransport } from './interfaces/IEmailSender';
import TemplateFactory                                                       from './TemplateFactory';
import { ITemplateFactoryDefaultData }                                       from './interfaces/ITemplateFactory';

export enum EMAIL_TYPES {
    PASSWORD_RESET = 'PASSWORD_RESET'
}

export default class EmailSender {
    private transporter : Transporter;

    private from : string;

    private defaultTemplateData : ITemplateFactoryDefaultData;

    constructor(args: IEmailSenderArgs) {
        this.transporter = this.createTransporter(args.transport, args.transportOptions);
        this.from = args.from;
        this.defaultTemplateData = args.defaultTemplateData;
    }

    private createTransporter(transport: TTransport, transportOptions: ITransportOptions) {
        switch (transport) {
            case 'SMTP':
                return nodemailer.createTransport(transportOptions);
            case 'TEST':
                return nodemailer.createTransport(stubTransport());

            default:
                throw new Error('Wrong mail transport');
        }
    }

    async sendMail(type: EMAIL_TYPES, destinationEmail: string, data: TTemplatePayload) {
        const templateData = {
            ...this.defaultTemplateData,
            ...data
        };

        const template = await TemplateFactory.getTemplate(type);

        return this.transporter.sendMail({
            from    : this.from,
            to      : destinationEmail,
            subject : template.subject(templateData),
            html    : template.body(templateData)
        });
    }
}


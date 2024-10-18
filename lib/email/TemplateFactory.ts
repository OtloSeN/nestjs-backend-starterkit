import path                   from 'path';
import fs                     from 'fs/promises';
import Handlebars             from 'handlebars';
import { EMAIL_TYPES }        from './EmailSender';
import { ITemplateInterface } from './interfaces/ITemplateFactory';

export const TEMPLATE_BY_EMAIL_TYPE: { [key in EMAIL_TYPES]: string } = {
    PASSWORD_RESET : 'passwordReset' // eslint-disable-line more/no-hardcoded-password
};

export default class TemplateFactory {
    private static cache : Record<string, ITemplateInterface> = {};

    static async getTemplate(emailType: EMAIL_TYPES): Promise<ITemplateInterface | never> {
        if (this.cache[emailType]) {
            return this.cache[emailType] as ITemplateInterface;
        }

        const [ bodyTemplate, subjectTemplate ] = await Promise.all([
            fs.readFile(path.join('templates', TEMPLATE_BY_EMAIL_TYPE[emailType], 'body.html'), 'utf-8'),
            fs.readFile(path.join('templates', TEMPLATE_BY_EMAIL_TYPE[emailType], 'subject.html'), 'utf-8')
        ]);

        this.cache[emailType] = {
            body    : Handlebars.compile(bodyTemplate),
            subject : Handlebars.compile(subjectTemplate)
        };

        return this.cache[emailType] as ITemplateInterface;
    }
}

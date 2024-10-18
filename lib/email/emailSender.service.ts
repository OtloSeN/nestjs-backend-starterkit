import IAppConfig              from 'configs/interfaces/IAppConfig';
import { CONFIG_PROVIDER_KEY } from 'configs/appConfig';
import EmailSender             from './EmailSender';

const EmailServiceProvider = {
    provide : EmailSender,
    useFactory(appConfig: IAppConfig) {
        return new EmailSender({
            ...appConfig.email,
            defaultTemplateData : {
                uiUrl : appConfig.uiUrl
            }
        });
    },
    inject : [
        { token: CONFIG_PROVIDER_KEY, optional: false }
    ]
};

export default EmailServiceProvider;

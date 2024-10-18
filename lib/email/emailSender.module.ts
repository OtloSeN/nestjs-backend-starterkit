import { Global, Module }   from '@nestjs/common';
import EmailServiceProvider from './emailSender.service';


@Global()
@Module({
    providers : [
        EmailServiceProvider
    ],
    exports : [
        EmailServiceProvider
    ]
})
export default class EmailSenderModule {}

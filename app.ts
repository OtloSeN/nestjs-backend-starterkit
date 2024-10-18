import 'reflect-metadata';
import AppProvider from 'src/AppProvider';
import appConfig   from 'configs/appConfig';

(async function bootstrap() {
    const appProvider = new AppProvider(appConfig);

    await appProvider.initApp();
    await appProvider.start();
}()).catch(err => {
    console.error(err);

    process.exit(1);
});

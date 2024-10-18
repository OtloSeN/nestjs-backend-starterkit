import { RouterModule } from '@nestjs/core';

export default class CustomRouterModule {
    static register(path: string, modules) {
        return RouterModule.register(modules.map(module => {
            return {
                path,
                module
            };
        }));
    }
}

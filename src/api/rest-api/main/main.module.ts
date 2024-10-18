import { Module }              from '@nestjs/common';
import CustomRouterModule      from '@common/CustomRouterModule';
import MainSessionModule       from './sessions/sessions.module';
import MainProfileModule       from './profiles/profiles.module';
import MainSystemActionsModule from './systemActions/systemActions.module';

const modules = [
    MainSessionModule,
    MainProfileModule,
    MainSystemActionsModule
];

@Module({
    imports : [
        CustomRouterModule.register('/api/v1', modules),
        ...modules
    ]
})
export default class MainModule {}

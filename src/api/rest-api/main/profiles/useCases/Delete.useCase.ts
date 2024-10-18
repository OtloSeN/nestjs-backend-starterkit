import { Injectable }     from '@nestjs/common';
import BaseUseCase        from '@common/BaseUseCase';
import User               from 'src/domain/models/User';
import { UserSessionDto } from '@common/dto';

@Injectable()
export default class MainProfileDelete extends BaseUseCase<
    undefined,
    UserSessionDto,
    void
> {
    protected async execute() {
        const user = await User.findOneOrFail({
            where : { id: this.sessionContext.userId }
        });

        await user.deleteProfile();
    }
}

import { Injectable }              from '@nestjs/common';
import BaseUseCase                 from '@common/BaseUseCase';
import User                        from 'src/domain/models/User';
import { UserDto, UserSessionDto } from '@common/dto';
import { dumpUser }                from '@common/dumps';

export class MainProfileShowReturn extends UserDto {}

@Injectable()
export default class MainProfileShow extends BaseUseCase<
    undefined,
    UserSessionDto,
    MainProfileShowReturn
> {
    protected async execute() {
        const user = await User.findOneOrFail({
            where : { id: this.sessionContext.userId }
        });

        return dumpUser(user);
    }
}

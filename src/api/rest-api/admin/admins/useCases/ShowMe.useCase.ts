import { Injectable }                from '@nestjs/common';
import BaseUseCase                   from '@common/BaseUseCase';
import { AdminDto, AdminSessionDto } from '@common/dto';
import Admin                         from '@domainModels/Admin';
import { dumpAdmin }                 from '@common/dumps';

export class AdminAdminShowMeReturn extends AdminDto {}

@Injectable()
export default class AdminAdminShowMe extends BaseUseCase<
    undefined,
    AdminSessionDto,
    AdminAdminShowMeReturn
> {
    protected async execute() {
        const admin = await  Admin.findOneOrFail({
            where : {
                id : this.sessionContext.adminId
            },
            relations : {
                role : true
            }
        });

        return dumpAdmin(admin);
    }
}

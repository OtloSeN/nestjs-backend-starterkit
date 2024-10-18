import { SystemActionDto } from '@common/dto';
import SystemAction        from '@domainModels/SystemAction';

export function dumpSystemAction(action: SystemAction) {
    return new SystemActionDto({
        id        : action.id,
        userId    : action.userId,
        type      : action.type,
        payload   : action.payload,
        expiresAt : action.expiresAt,
        createdAt : action.createdAt
    });
}

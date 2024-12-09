import { ForbiddenException as NestForbiddenException } from '@nestjs/common';

export class ForbiddenRequestException extends NestForbiddenException {
    constructor(error: { code: string, details?: object }) {
        super(error);
    }
}

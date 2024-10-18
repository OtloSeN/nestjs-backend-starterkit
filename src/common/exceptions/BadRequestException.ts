import { BadRequestException as NestBadRequestException } from '@nestjs/common';

export class BadRequestException extends NestBadRequestException {
    constructor(error: { code: string, details?: object }) {
        super(error);
    }
}

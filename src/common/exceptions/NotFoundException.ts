import { NotFoundException as NestNotFoundException } from '@nestjs/common';

export class NotFoundException extends NestNotFoundException {
    constructor(error: { code: string, details?: object }) {
        super(error);
    }
}

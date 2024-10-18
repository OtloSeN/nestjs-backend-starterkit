import { Reflector } from '@nestjs/core';

const IsPublic = Reflector.createDecorator<boolean>();

export default IsPublic;

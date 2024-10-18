import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags }               from '@nestjs/swagger';
import AdminSessionGuard         from './sessions.guard';

@ApiTags('Sessions')
@Controller('/sessions')
@UseGuards(AdminSessionGuard)
export default class AdminSessionController {
}

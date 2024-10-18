import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags }               from '@nestjs/swagger';
import AdminSessionGuard         from '../sessions/sessions.guard';

@ApiTags('Users')
@Controller('/users')
@UseGuards(AdminSessionGuard)
export default class AdminUserController {
}

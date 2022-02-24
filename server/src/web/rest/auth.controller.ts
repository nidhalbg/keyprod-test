import { Controller, Get, Logger, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { User } from '../../domain/user.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';

@Controller('api/users')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('auth-controller')
export class AuthController {
  logger = new Logger('AuthController');

  constructor() {}

}

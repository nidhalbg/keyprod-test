import { Body, Param, Post, Res, UseGuards, Controller, Get, Logger, Req, UseInterceptors } from '@nestjs/common';
import { Response, Request } from 'express';
import { User } from '../../domain/user.entity';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../../service/auth.service';
import { UserService } from '../../service/user.service';

@Controller('api')
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('account-resource')
export class AccountController {
  logger = new Logger('AccountController');

  constructor(private readonly _authService: AuthService, private readonly _userService: UserService) {}


  @Post('/register')
  @ApiOperation({ title: 'Register user' })
  @ApiResponse({
    status: 201,
    description: 'Registered user',
    type: User
  })
  async registerAccount(@Req() req: Request, @Body() user: User, @Res() res: Response): Promise<any> {
    await this._userService.new(user);
    return res.json(user);
  }

  @Get('/authenticate')
  @ApiOperation({ title: 'Check if the user is authenticated' })
  @ApiResponse({
    status: 200,
    description: 'login authenticated'
  })
  isAuthenticated(@Req() req: Request): any {
    const user: any = req.user;
    return user.login;
  }

  @Get('/account')
  @ApiOperation({ title: 'Get the current user.' })
  @ApiResponse({
    status: 200,
    description: 'user retrieved'
  })
  async getAccount(@Req() req: Request): Promise<any> {
    const user: any = req.user;
    return await this._authService.findUserWithAuthById(user.id);
  }
}

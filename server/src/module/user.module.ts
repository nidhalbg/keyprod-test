import { Module } from '@nestjs/common';
import { UserController } from '../web/rest/user.controller';
import { ManagementController } from '../web/rest/management.controller';
import { UserRepository } from '../repository/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { LogService } from '../service/log.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],

  controllers: [UserController, ManagementController],

  providers: [
    UserService,
    LogService],

  exports: [UserService]
})
export class UserModule { }

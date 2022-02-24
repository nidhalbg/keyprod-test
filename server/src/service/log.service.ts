import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { User } from '../domain/user.entity';

@Injectable()
export class LogService {
  logger = new Logger('LogService');
  constructor() {}

  logOnCreate(data: any, user: User) {
    data.createdBy = user.login;
    data.createdDate = new Date(Date.now());
    data.lastModifiedBy = user.login;
    data.lastModifiedDate = new Date(Date.now());

    return data;
  }

  logOnUpdate(data: any, user: User) {
    data.lastModifiedBy = user.login;
    data.lastModifiedDate = new Date(Date.now());

    return data;
  }
}

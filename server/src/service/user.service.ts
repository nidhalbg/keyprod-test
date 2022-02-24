import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../domain/user.entity';
import { UserRepository } from '../repository/user.repository';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { LogService } from './log.service';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserRepository) private _userRepository: UserRepository,
    private _logService: LogService) { }

  async findById(id: string): Promise<User | undefined> {
    const result = await this._userRepository.findOne(id);
    result.password = "";
    return this._flatAuthorities(result);
  }

  async findByfields(options: FindOneOptions<User>): Promise<User | undefined> {
    options.relations = ['authorities'];
    const result = await this._userRepository.findOne(options);
    result.password = "";
    return this._flatAuthorities(result);
  }

  async find(options: FindManyOptions<User>): Promise<User | undefined> {
    options.relations = ['authorities'];
    const result = await this._userRepository.findOne(options);
    if(result == undefined){
      return null ;
    }
    result.password = "";
    return this._flatAuthorities(result);
  }

  async findAndCount(options: FindManyOptions<User>): Promise<[User[], number]> {
    options.relations = ['authorities'];
    const resultList = await this._userRepository.findAndCount(options);
    const users: User[] = [];
    if (resultList && resultList[0]) {
      resultList[0].forEach(user => {
        user.password = "";
        users.push(this._flatAuthorities(user));
      });
      resultList[0] = users;
    }
    return resultList;
  }

  async new(user: User): Promise<User | undefined> {
    const result = await this._userRepository.save(user);
    return result;
  }

  async save(user: User, currentUser: any): Promise<User | undefined> {
    user = this._convertInAuthorities(user);
    user = this._logService.logOnCreate(user, currentUser);
    const result = await this._userRepository.save(user);
    return this._flatAuthorities(result);
  }

  async update(user: User, currentUser: any): Promise<User | undefined> {
    user = this._convertInAuthorities(user);
    user = this._logService.logOnUpdate(user, currentUser);
    const result = await this._userRepository.save(user);
    return this._flatAuthorities(result);
  }

  async delete(user: User): Promise<User | undefined> {
    return await this._userRepository.remove(user);
  }

  private _flatAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: string[] = [];
      user.authorities.forEach(authority => authorities.push(authority.name));
      user.authorities = authorities;
    }
    return user;
  }

  private _convertInAuthorities(user: any): User {
    if (user && user.authorities) {
      const authorities: any[] = [];
      user.authorities.forEach(authority => authorities.push({ name: authority }));
      user.authorities = authorities;
    }
    return user;
  }
}

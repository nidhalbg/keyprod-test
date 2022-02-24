import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from '../service/dto/user-login.dto';
import { Payload } from '../security/payload.interface';
import { Authority } from '../domain/authority.entity';
import { User } from '../domain/user.entity';
import { AuthorityRepository } from '../repository/authority.repository';
import { UserService } from '../service/user.service';

@Injectable()
export class AuthService {
  logger = new Logger('AuthService');
  constructor(
    private readonly _jwtService: JwtService,
    @InjectRepository(AuthorityRepository) private _authorityRepository: AuthorityRepository,
    private _userService: UserService
  ) {}

  async login(userLogin: UserLoginDTO): Promise<any> {
    const loginUserName = userLogin.username;
    const loginPassword = userLogin.password;

    const userFind = await this._userService.findByfields({ where: { login: loginUserName, password: loginPassword } });
    if (!userFind) {
      throw new HttpException('Invalid login name or password.', HttpStatus.BAD_REQUEST);
    }

    const user = await this.findUserWithAuthById(userFind.id);

    const payload: Payload = { id: user.id, username: user.login, authorities: user.authorities };

    /* eslint-disable */
    return {
      token: this._jwtService.sign(payload),
      user: user
    };
  }

  /* eslint-enable */
  async validateUser(payload: Payload): Promise<User | undefined> {
    return await this.findUserWithAuthById(payload.id);
  }

  async find(): Promise<Authority[]> {
    return await this._authorityRepository.find();
  }

  async findUserWithAuthById(userId: number): Promise<User | undefined> {
    const user: any = await this._userService.findByfields({ where: { id: userId } });
    return user;
  }
}

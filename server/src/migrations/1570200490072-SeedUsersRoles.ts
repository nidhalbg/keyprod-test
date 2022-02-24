import { MigrationInterface, QueryRunner } from 'typeorm';
import { User } from '../domain/user.entity';
import { Authority } from '../domain/authority.entity';
import Todo from '../domain/todo.entity';

export class SeedUsersRoles1570200490072 implements MigrationInterface {
  role: Authority = { name: 'ROLE_LOGISTICIAN' };
  
  DateNow = new Date(Date.now());

  user: User = {
    login: 'logisticien',
    password: '1234',
    fullName: 'Logisticien',
    email: 'Logisticien@keyprod.com',
    createdBy: 'logisticien',
    createdDate: this.DateNow,
    lastModifiedBy: 'logisticien',
    lastModifiedDate: this.DateNow,
  };


  public async up(queryRunner: QueryRunner): Promise<any> {
    const conn = queryRunner.connection;
    await conn
      .createQueryBuilder()
      .insert()
      .into(Authority)
      .values([this.role])
      .execute();

    await conn
      .createQueryBuilder()
      .insert()
      .into(User)
      .values([this.user])
      .execute();

    await conn
      .createQueryBuilder()
      .relation(User, 'authorities')
      .of([this.user])
      .add([this.role]);
  }

  // eslint-disable-next-line
  public async down(queryRunner: QueryRunner): Promise<any> { }
}

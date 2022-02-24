import { Authority } from './authority.entity';
import { Entity, Column, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import { ApiModelProperty } from '@nestjs/swagger';
import { config } from '../config';
import { EncryptionTransformer } from 'typeorm-encrypted';
import Todo from './todo.entity';

@Entity('user')
export class User extends BaseEntity {

  @ApiModelProperty({ uniqueItems: true, example: 'myuser', description: 'User login' })
  @Column({ unique: true })
  login: string;

  @ApiModelProperty({ example: 'MyUser', description: 'User fullfirst' })
  @Column({ name: 'full_name' })
  fullName: string;

  @ApiModelProperty({ example: 'myuser@localhost', description: 'User email' })
  @Column({ nullable: true })
  email?: string;

  @ApiModelProperty({ example: 'myuser', description: 'User password' })
  @Column({
    type: 'varchar',
    transformer: new EncryptionTransformer({
      key: config.get('crypto.key'),
      algorithm: 'aes-256-cbc',
      ivLength: 16,
      iv: config.get('crypto.iv')
    })
  })
  password: string;


  // eslint-disable-next-line
  @ManyToMany(type => Authority)
  @JoinTable()
  @ApiModelProperty({ isArray: true, enum: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_ANONYMOUS'], description: 'Array of permissions' })
  authorities?: any[];

  @OneToMany(
    type => Todo,
    todo => todo.user
  )
  todos?: Todo[];

}

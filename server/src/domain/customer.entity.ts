/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base/base.entity';


/**
 * A DataSource.
 */
@Entity('customer')
export default class Customer extends BaseEntity {

  @Column({ name: 'fullname', nullable: false })
  fullname: string;

  @Column({ name: 'adress', type: 'text', nullable: false })
  adress: string;

}

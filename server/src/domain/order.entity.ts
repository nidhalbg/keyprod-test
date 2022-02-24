/* eslint-disable @typescript-eslint/no-unused-vars */
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base/base.entity';
import Customer from './customer.entity';

export enum OrderStatus {
    ToPrepare = "to prepare",
    InProgress = "In progress",
    Deliver = "Deliver"
}
/**
 * A DataSource.
 */
@Entity('order')
export default class Order extends BaseEntity {

  @Column({ name: 'title', nullable: false })
  title: string;

  @Column({ name: 'description', type: 'text', nullable: false })
  description: string;

  @Column({ name: 'due_date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  due_date?: Date;

  @Column({
      type: "enum",
      enum: OrderStatus,
      default: OrderStatus.ToPrepare
  })
  status: OrderStatus;

  @ManyToOne(type => Customer)
  @JoinColumn({
    name: "customer_id",
    referencedColumnName: "id"
  })
  user: Customer;


}

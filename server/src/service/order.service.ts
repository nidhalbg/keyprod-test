import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import Order from '../domain/order.entity';
import { OrderRepository } from '../repository/order.repository';
import { LogService } from './log.service';

const relationshipNames = [];

@Injectable()
export class OrderService {
  logger = new Logger('DataSourceService');

  constructor(@InjectRepository(OrderRepository) private _orderRepository: OrderRepository,
    private _logService: LogService) { }

  async findById(id: string): Promise<Order | undefined> {
    const options = { relations: relationshipNames };
    return await this._orderRepository.findOne(id, options);
  }

  async findByfields(options: FindOneOptions<Order>): Promise<Order | undefined> {
    return await this._orderRepository.findOne(options);
  }

  async findAndCount(options: FindManyOptions<Order>): Promise<[Order[], number]> {
    options.relations = relationshipNames;
    return await this._orderRepository.findAndCount(options);
  }

  async save(Order: Order, user: any): Promise<Order | undefined> {
    Order = this._logService.logOnCreate(Order, user);
    return await this._orderRepository.save(Order);
  }

  async update(Order: Order, user: any): Promise<Order | undefined> {
    Order = this._logService.logOnUpdate(Order, user);
    return await this._orderRepository.save(Order)
  }

  async delete(Order: Order): Promise<Order | undefined> {
    return await this._orderRepository.remove(Order);
  }

  async findByCustomerId(customerId: number): Promise<Order[]> {
    return await this._orderRepository
      .createQueryBuilder("Order")
      .where("Order.user_id = :customer_id", { customer_id: customerId })
      .getMany();
  }

}

import { EntityRepository, Repository } from 'typeorm';
import Order from '../domain/Order.entity';

@EntityRepository(Order)
export class OrderRepository extends Repository<Order> {

}

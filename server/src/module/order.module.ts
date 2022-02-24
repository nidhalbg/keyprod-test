import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from '../web/rest/oder.controller';
import { OrderRepository } from '../repository/Order.repository';
import { OrderService } from '../service/Order.service';
import { LogService } from '../service/log.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderRepository]),
  ],

  controllers: [OrderController],

  providers: [
    OrderService,
    LogService
  ],

  exports: [OrderService]
})
export class OrderModule { }

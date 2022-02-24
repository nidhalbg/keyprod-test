import { Body, Controller, Delete, Get, Logger, Param, Post as PostMethod, Put, UseGuards, Req, UseInterceptors , HttpException, HttpStatus} from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags, ApiResponse, ApiOperation } from '@nestjs/swagger';
import { Request } from 'express';
import Order from '../../domain/order.entity';
import { User } from '../../domain/user.entity';
import { OrderService } from '../../service/order.service';
import { PageRequest, Page } from '../../domain/base/pagination.entity';
import { AuthGuard, Roles, RolesGuard, RoleType } from '../../security';
import { HeaderUtil } from '../../client/header-util';
import { LoggingInterceptor } from '../../client/interceptors/logging.interceptor';

@Controller('api/orders')
@UseGuards(AuthGuard, RolesGuard)
@UseInterceptors(LoggingInterceptor)
@ApiBearerAuth()
@ApiUseTags('orders')
export class OrderController {
  logger = new Logger('OrderController');

  constructor(private readonly _orderService: OrderService) { }

  @Get('/')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'List all records',
    type: Order
  })
  async getAll(@Req() req: Request): Promise<Order[]> {
    const pageRequest: PageRequest = new PageRequest(req.query.page, req.query.size, req.query.sort);
    const [results, count] = await this._orderService.findAndCount({
      skip: +pageRequest.page * pageRequest.size,
      take: +pageRequest.size,
      order: pageRequest.sort.asOrder()
    });
    HeaderUtil.addPaginationHeaders(req.res, new Page(results, count, pageRequest));
    return results;
  }



  @PostMethod('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Create order' })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: Order
  })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async post(@Req() req: Request, @Body() order: Order): Promise<Order> {
    const created = await this._orderService.save(order, req.user);
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Order', created.id);
    return created;
  }

  @Put('/')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Update order' })
  @ApiResponse({
    status: 200,
    description: 'The record has been successfully updated.',
    type: Order
  })
  async put(@Req() req: Request, @Body() order: Order): Promise<Order> {
    HeaderUtil.addEntityCreatedHeaders(req.res, 'Order', order.id);
    return await this._orderService.update(order, req.user);
  }

  @Delete('/:id')
  @Roles(RoleType.USER)
  @ApiOperation({ title: 'Delete order' })
  @ApiResponse({
    status: 204,
    description: 'The record has been successfully deleted.'
  })
  async remove(@Req() req: Request, @Param('id') id: string): Promise<Order> {
    HeaderUtil.addEntityDeletedHeaders(req.res, 'Order', id);
    const toDelete = await this._orderService.findById(id);
    return await this._orderService.delete(toDelete);
  }

  @Get('user')
  @ApiResponse({
    status: 200,
    description: 'Get user orders',
    type: Order
  })
  async getUserOrders(@Req() req: Request): Promise<Order[]> {
    const user = req.user;
    const orders = await this._orderService.findByCustomerId(user['id']);
    if (orders == null) {
      throw new HttpException({ status: HttpStatus.FORBIDDEN, error: 'This is a custom message', }, HttpStatus.NOT_FOUND);
    }
    return orders;
  }

  @Get('/:id')
  @Roles(RoleType.USER)
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Order
  })
  async getOne(@Param('id') id: string): Promise<Order> {
    return await this._orderService.findById(id);
  }

}

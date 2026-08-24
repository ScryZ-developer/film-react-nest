import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() dto: CreateOrderDto): Promise<OrderResponseDto> {
    return this.orderService.create(dto);
  }
}

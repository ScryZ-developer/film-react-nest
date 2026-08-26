import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: jest.Mocked<Pick<OrderService, 'create'>>;

  beforeEach(async () => {
    orderService = {
      create: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: orderService,
        },
      ],
    }).compile();

    controller = module.get(OrderController);
  });

  describe('create', () => {
    it('should create an order through OrderService and return tickets', async () => {
      const dto: CreateOrderDto = {
        email: 'user@example.com',
        phone: '+79990001122',
        tickets: [
          {
            film: '11111111-1111-1111-1111-111111111111',
            session: '22222222-2222-2222-2222-222222222222',
            daytime: '2024-01-01T12:00:00',
            row: 1,
            seat: 2,
            price: 350,
          },
        ],
      };
      const response: OrderResponseDto = {
        total: 1,
        items: [
          {
            ...dto.tickets[0],
            id: '33333333-3333-3333-3333-333333333333',
          },
        ],
      };
      orderService.create.mockResolvedValue(response);

      await expect(controller.create(dto)).resolves.toEqual(response);
      expect(orderService.create).toHaveBeenCalledWith(dto);
    });
  });
});

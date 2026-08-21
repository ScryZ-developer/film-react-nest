import { randomUUID } from 'node:crypto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { FilmsService } from '../films/films.service';
import { CreateOrderDto, OrderResponseDto, TicketDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsService: FilmsService) {}

  async create(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const tickets = dto.tickets ?? [];
    if (tickets.length === 0) {
      throw new BadRequestException({ error: 'Список билетов пуст' });
    }

    this.assertNoDuplicateSeats(tickets);

    const seatsBySession = this.groupSeatsBySession(tickets);

    for (const group of seatsBySession) {
      await this.filmsService.occupySeats(
        group.filmId,
        group.sessionId,
        group.seats,
      );
    }

    const items = tickets.map((ticket) => ({
      ...ticket,
      id: randomUUID(),
    }));

    return {
      total: items.length,
      items,
    };
  }

  private assertNoDuplicateSeats(tickets: TicketDto[]) {
    const unique = new Set<string>();

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}:${ticket.row}:${ticket.seat}`;
      if (unique.has(key)) {
        throw new BadRequestException({
          error: `Место ${ticket.row}:${ticket.seat} указано в заказе дважды`,
        });
      }
      unique.add(key);
    }
  }

  private groupSeatsBySession(tickets: TicketDto[]) {
    const groups = new Map<
      string,
      { filmId: string; sessionId: string; seats: string[] }
    >();

    for (const ticket of tickets) {
      const key = `${ticket.film}:${ticket.session}`;
      const place = `${ticket.row}:${ticket.seat}`;
      const group = groups.get(key);

      if (group) {
        group.seats.push(place);
      } else {
        groups.set(key, {
          filmId: ticket.film,
          sessionId: ticket.session,
          seats: [place],
        });
      }
    }

    return [...groups.values()];
  }
}

import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { connect, disconnect } from 'mongoose';
import { AppConfig } from '../app.config.provider';
import { FilmDetailsDto } from '../films/dto/films.dto';
import { FilmModel } from '../films/schemas/film.schema';
import { toFilmDetailsDto } from './film.mapper';
import { IFilmsRepository } from './films.repository';

@Injectable()
export class FilmsMongodbRepository
  implements IFilmsRepository, OnModuleInit, OnModuleDestroy
{
  constructor(@Inject('CONFIG') private readonly config: AppConfig) {}

  async onModuleInit() {
    if (this.config.database.driver === 'memory') {
      return;
    }

    await connect(this.config.database.url);
  }

  async onModuleDestroy() {
    await disconnect();
  }

  async findAll(): Promise<FilmDetailsDto[]> {
    const films = await FilmModel.find().lean().exec();
    return films.map(toFilmDetailsDto);
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = await FilmModel.findOne({ id }).lean().exec();
    return film ? toFilmDetailsDto(film) : null;
  }

  async occupySeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    const film = await FilmModel.findOne({ id: filmId }).lean().exec();
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }

    const session = film.schedule.find((item) => item.id === sessionId);
    if (!session) {
      throw new NotFoundException({ error: 'Сеанс не найден' });
    }

    const result = await FilmModel.updateOne(
      { id: filmId },
      {
        $addToSet: {
          'schedule.$[session].taken': { $each: seats },
        },
      },
      {
        arrayFilters: [
          {
            'session.id': sessionId,
            'session.taken': { $nin: seats },
          },
        ],
      },
    ).exec();

    if (result.modifiedCount === 0) {
      const occupied = seats.find((seat) => session.taken.includes(seat));
      throw new BadRequestException({
        error: `Место ${occupied ?? seats[0]} уже занято`,
      });
    }
  }
}

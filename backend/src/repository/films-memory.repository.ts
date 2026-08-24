import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { FilmDetailsDto } from '../films/dto/films.dto';
import { toFilmDetailsDto } from './film.mapper';
import { IFilmsRepository } from './films.repository';

@Injectable()
export class FilmsMemoryRepository implements IFilmsRepository {
  private films: FilmDetailsDto[] = [];

  constructor() {
    const filePath = path.join(
      __dirname,
      '..',
      '..',
      'test',
      'mongodb_initial_stub.json',
    );
    const raw = fs.readFileSync(filePath, 'utf-8');
    const items = JSON.parse(raw) as FilmDetailsDto[];
    this.films = items.map((film) =>
      toFilmDetailsDto(JSON.parse(JSON.stringify(film)) as FilmDetailsDto),
    );
  }

  async findAll(): Promise<FilmDetailsDto[]> {
    return this.films.map((film) => toFilmDetailsDto(film));
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = this.films.find((item) => item.id === id);
    return film ? toFilmDetailsDto(film) : null;
  }

  async occupySeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    const film = this.films.find((item) => item.id === filmId);
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }

    const session = film.schedule.find((item) => item.id === sessionId);
    if (!session) {
      throw new NotFoundException({ error: 'Сеанс не найден' });
    }

    const taken = new Set(session.taken);
    const occupied = seats.find((seat) => taken.has(seat));
    if (occupied) {
      throw new BadRequestException({
        error: `Место ${occupied} уже занято`,
      });
    }

    session.taken.push(...seats);
  }
}

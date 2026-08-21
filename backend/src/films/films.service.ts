import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  FilmDetailsDto,
  FilmsResponseDto,
  ScheduleResponseDto,
} from './dto/films.dto';
import { toFilmDto } from '../repository/film.mapper';
import {
  FILMS_REPOSITORY,
  IFilmsRepository,
} from '../repository/films.repository';

@Injectable()
export class FilmsService {
  constructor(
    @Inject(FILMS_REPOSITORY)
    private readonly filmsRepository: IFilmsRepository,
  ) {}

  async findAll(): Promise<FilmsResponseDto> {
    const films = await this.filmsRepository.findAll();
    const items = films.map(toFilmDto);

    return {
      total: items.length,
      items,
    };
  }

  async findById(id: string): Promise<FilmDetailsDto> {
    const film = await this.filmsRepository.findById(id);
    if (!film) {
      throw new NotFoundException({ error: 'Фильм не найден' });
    }

    return film;
  }

  async findSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.findById(id);

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }

  async occupySeats(filmId: string, sessionId: string, seats: string[]) {
    await this.filmsRepository.occupySeats(filmId, sessionId, seats);
  }
}

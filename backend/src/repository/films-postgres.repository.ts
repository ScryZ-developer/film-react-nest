import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { FilmDetailsDto } from '../films/dto/films.dto';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { toFilmDetailsDto } from './film.mapper';
import { IFilmsRepository } from './films.repository';

@Injectable()
export class FilmsPostgresRepository implements IFilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmRepository: Repository<Film>,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(): Promise<FilmDetailsDto[]> {
    const films = await this.filmRepository.find({
      relations: { schedule: true },
      order: {
        schedule: {
          daytime: 'ASC',
        },
      },
    });

    return films.map(toFilmDetailsDto);
  }

  async findById(id: string): Promise<FilmDetailsDto | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
      order: {
        schedule: {
          daytime: 'ASC',
        },
      },
    });

    return film ? toFilmDetailsDto(film) : null;
  }

  async occupySeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const film = await queryRunner.manager.findOne(Film, {
        where: { id: filmId },
      });
      if (!film) {
        throw new NotFoundException({ error: 'Фильм не найден' });
      }

      const schedule = await queryRunner.manager
        .getRepository(Schedule)
        .createQueryBuilder('schedule')
        .setLock('pessimistic_write')
        .where('schedule.id = :sessionId', { sessionId })
        .andWhere('schedule.filmId = :filmId', { filmId })
        .getOne();

      if (!schedule) {
        throw new NotFoundException({ error: 'Сеанс не найден' });
      }

      const taken = schedule.taken ?? [];
      const occupied = seats.find((seat) => taken.includes(seat));
      if (occupied) {
        throw new BadRequestException({
          error: `Место ${occupied} уже занято`,
        });
      }

      schedule.taken = [...taken, ...seats];
      await queryRunner.manager.save(schedule);
      await queryRunner.commitTransaction();
    } catch (error: unknown) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}

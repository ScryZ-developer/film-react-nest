import { FilmDetailsDto } from '../films/dto/films.dto';

export const FILMS_REPOSITORY = 'FILMS_REPOSITORY';

export interface IFilmsRepository {
  findAll(): Promise<FilmDetailsDto[]>;
  findById(id: string): Promise<FilmDetailsDto | null>;
  occupySeats(
    filmId: string,
    sessionId: string,
    seats: string[],
  ): Promise<void>;
}

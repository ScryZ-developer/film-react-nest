import { FilmDetailsDto, FilmDto, ScheduleDto } from '../films/dto/films.dto';

export function toFilmDto(film: FilmDetailsDto): FilmDto {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags,
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
  };
}

export function toScheduleDto(schedule: ScheduleDto): ScheduleDto {
  return {
    id: schedule.id,
    daytime: schedule.daytime,
    hall: schedule.hall,
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: [...(schedule.taken ?? [])],
  };
}

export function toFilmDetailsDto(film: FilmDetailsDto): FilmDetailsDto {
  return {
    ...toFilmDto(film),
    schedule: (film.schedule ?? []).map(toScheduleDto),
  };
}

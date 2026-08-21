export class FilmDto {
  id: string;
  rating: number;
  director: string;
  tags: string[];
  title: string;
  about: string;
  description: string;
  image: string;
  cover: string;
}

export class ScheduleDto {
  id: string;
  daytime: string;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class FilmDetailsDto extends FilmDto {
  schedule: ScheduleDto[];
}

export class FilmsResponseDto {
  total: number;
  items: FilmDto[];
}

export class ScheduleResponseDto {
  total: number;
  items: ScheduleDto[];
}

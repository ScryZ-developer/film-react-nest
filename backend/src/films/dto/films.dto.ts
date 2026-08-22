import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';

export class FilmDto {
  @IsUUID()
  id: string;

  @IsNumber()
  rating: number;

  @IsString()
  @IsNotEmpty()
  director: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  about: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  cover: string;
}

export class ScheduleDto {
  @IsUUID()
  id: string;

  @IsString()
  @IsNotEmpty()
  daytime: string;

  @IsInt()
  hall: number;

  @IsInt()
  @Min(1)
  rows: number;

  @IsInt()
  @Min(1)
  seats: number;

  @IsNumber()
  @Min(0)
  price: number;

  @IsArray()
  @IsString({ each: true })
  taken: string[];
}

export class FilmDetailsDto extends FilmDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  schedule: ScheduleDto[];
}

export class FilmsResponseDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FilmDto)
  items: FilmDto[];
}

export class ScheduleResponseDto {
  @IsInt()
  @Min(0)
  total: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScheduleDto)
  items: ScheduleDto[];
}

import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  findAll(): Promise<FilmsResponseDto> {
    return this.filmsService.findAll();
  }

  @Get(':id/schedule')
  findSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return this.filmsService.findSchedule(id);
  }
}

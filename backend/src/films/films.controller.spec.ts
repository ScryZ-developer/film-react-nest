import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: jest.Mocked<Pick<FilmsService, 'findAll' | 'findSchedule'>>;

  beforeEach(async () => {
    filmsService = {
      findAll: jest.fn(),
      findSchedule: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        {
          provide: FilmsService,
          useValue: filmsService,
        },
      ],
    }).compile();

    controller = module.get(FilmsController);
  });

  describe('findAll', () => {
    it('should return a list of films from FilmsService', async () => {
      const response: FilmsResponseDto = {
        total: 1,
        items: [
          {
            id: '11111111-1111-1111-1111-111111111111',
            rating: 8.5,
            director: 'Director',
            tags: ['drama'],
            title: 'Film',
            about: 'About',
            description: 'Description',
            image: '/image.png',
            cover: '/cover.png',
          },
        ],
      };
      filmsService.findAll.mockResolvedValue(response);

      await expect(controller.findAll()).resolves.toEqual(response);
      expect(filmsService.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from FilmsService', async () => {
      const error = new Error('database unavailable');
      filmsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow(error);
    });
  });

  describe('findSchedule', () => {
    it('should return a film schedule by id from FilmsService', async () => {
      const filmId = '11111111-1111-1111-1111-111111111111';
      const response: ScheduleResponseDto = {
        total: 1,
        items: [
          {
            id: '22222222-2222-2222-2222-222222222222',
            daytime: '2024-01-01T12:00:00',
            hall: 1,
            rows: 5,
            seats: 10,
            price: 350,
            taken: [],
          },
        ],
      };
      filmsService.findSchedule.mockResolvedValue(response);

      await expect(controller.findSchedule(filmId)).resolves.toEqual(response);
      expect(filmsService.findSchedule).toHaveBeenCalledWith(filmId);
    });

    it('should propagate NotFoundException from FilmsService', async () => {
      const filmId = '11111111-1111-1111-1111-111111111111';
      const error = new NotFoundException({ error: 'Фильм не найден' });
      filmsService.findSchedule.mockRejectedValue(error);

      await expect(controller.findSchedule(filmId)).rejects.toThrow(error);
    });
  });
});

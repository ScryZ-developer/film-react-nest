import { Global, Module } from '@nestjs/common';
import 'dotenv/config';
import { FILMS_REPOSITORY } from './films.repository';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongodbRepository } from './films-mongodb.repository';

@Global()
@Module({
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass:
        process.env.DATABASE_DRIVER === 'memory'
          ? FilmsMemoryRepository
          : FilmsMongodbRepository,
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}

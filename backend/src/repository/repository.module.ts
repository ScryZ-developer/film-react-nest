import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from '../app.config.module';
import { FILMS_REPOSITORY } from './films.repository';
import { FilmsMemoryRepository } from './films-memory.repository';
import { FilmsMongodbRepository } from './films-mongodb.repository';

@Global()
@Module({
  imports: [AppConfigModule],
  providers: [
    FilmsMongodbRepository,
    FilmsMemoryRepository,
    {
      provide: FILMS_REPOSITORY,
      useFactory: (
        configService: ConfigService,
        mongo: FilmsMongodbRepository,
        memory: FilmsMemoryRepository,
      ) => {
        return configService.get<string>('DATABASE_DRIVER') === 'memory'
          ? memory
          : mongo;
      },
      inject: [ConfigService, FilmsMongodbRepository, FilmsMemoryRepository],
    },
  ],
  exports: [FILMS_REPOSITORY],
})
export class RepositoryModule {}

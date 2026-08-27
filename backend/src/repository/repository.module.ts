import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfigModule } from '../app.config.module';
import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { FILMS_REPOSITORY } from './films.repository';
import { FilmsPostgresRepository } from './films-postgres.repository';

@Global()
@Module({
  imports: [
    AppConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const databaseUrl =
          configService.get<string>('DATABASE_URL') ??
          'postgres://localhost:5432/prac';
        const { hostname, port, pathname } = new URL(databaseUrl);

        return {
          type: 'postgres' as const,
          host: hostname,
          port: Number(port) || 5432,
          database: pathname.replace(/^\//, ''),
          username: configService.get<string>('DATABASE_USERNAME'),
          password: configService.get<string>('DATABASE_PASSWORD'),
          entities: [Film, Schedule],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [
    {
      provide: FILMS_REPOSITORY,
      useClass: FilmsPostgresRepository,
    },
  ],
  exports: [FILMS_REPOSITORY, TypeOrmModule],
})
export class RepositoryModule {}

import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { AppConfigModule } from './app.config.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';
import { RepositoryModule } from './repository/repository.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    AppConfigModule,
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
    }),
    RepositoryModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

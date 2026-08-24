import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT') ?? 3000),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'mongodb',
      url:
        configService.get<string>('DATABASE_URL') ??
        'mongodb://localhost:27017/prac',
    },
  }),
};

export interface AppConfig {
  port: number;
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}

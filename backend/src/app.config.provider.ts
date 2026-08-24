import { ConfigService } from '@nestjs/config';

export const configProvider = {
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    port: Number(configService.get<string>('PORT') ?? 3000),
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'postgres',
      url:
        configService.get<string>('DATABASE_URL') ??
        'postgres://localhost:5432/prac',
      username: configService.get<string>('DATABASE_USERNAME') ?? 'prac',
      password: configService.get<string>('DATABASE_PASSWORD') ?? 'prac',
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
  username: string;
  password: string;
}

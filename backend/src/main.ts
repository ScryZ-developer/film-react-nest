import { NestFactory } from '@nestjs/core';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ValidationError } from 'class-validator';
import { AppModule } from './app.module';
import { createLogger } from './logger/logger.factory';

function flattenValidationMessages(errors: ValidationError[]): string[] {
  return errors.flatMap((error) => [
    ...Object.values(error.constraints ?? {}),
    ...flattenValidationMessages(error.children ?? []),
  ]);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });
  const configService = app.get(ConfigService);
  const port = Number(configService.get<string>('PORT') ?? 3000);
  const loggerType = configService.get<string>('LOGGER_TYPE');

  app.useLogger(createLogger(loggerType));
  app.setGlobalPrefix('api/afisha', {
    exclude: ['content/afisha/(.*)'],
  });
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = flattenValidationMessages(errors);
        return new BadRequestException({
          error: messages.join('; ') || 'Некорректные данные запроса',
        });
      },
    }),
  );
  await app.listen(port);
}
bootstrap();

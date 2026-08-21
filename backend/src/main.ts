import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/afisha', {
    exclude: ['content/afisha/(.*)'],
  });
  app.enableCors();
  await app.listen(3000);
}
bootstrap();

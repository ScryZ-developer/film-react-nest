import { Global, Module } from '@nestjs/common';
import { configProvider } from './app.config.provider';

@Global()
@Module({
  providers: [configProvider],
  exports: ['CONFIG'],
})
export class AppConfigModule {}

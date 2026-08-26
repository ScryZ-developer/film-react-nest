import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export type LoggerType = 'dev' | 'json' | 'tskv';

export function createLogger(
  type: string | undefined = process.env.LOGGER_TYPE,
): LoggerService {
  switch ((type ?? 'dev').toLowerCase()) {
    case 'json':
      return new JsonLogger();
    case 'tskv':
      return new TskvLogger();
    case 'dev':
    default:
      return new DevLogger();
  }
}

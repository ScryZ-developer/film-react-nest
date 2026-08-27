import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new JsonLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    debugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should return a JSON string with level, message and optionalParams', () => {
      const result = logger.formatMessage('log', 'hello', 'ctx');

      expect(JSON.parse(result)).toEqual({
        level: 'log',
        message: 'hello',
        optionalParams: ['ctx'],
      });
    });

    it('should keep complex message values serializable', () => {
      const result = logger.formatMessage('error', { code: 500 }, 'trace');

      expect(JSON.parse(result)).toEqual({
        level: 'error',
        message: { code: 500 },
        optionalParams: ['trace'],
      });
    });
  });

  describe('log levels', () => {
    it('should write log level messages through console.log', () => {
      logger.log('info message', 'FilmsController');

      expect(logSpy).toHaveBeenCalledWith(
        logger.formatMessage('log', 'info message', 'FilmsController'),
      );
    });

    it('should write error level messages through console.error', () => {
      logger.error('fail', 'stack');

      expect(errorSpy).toHaveBeenCalledWith(
        logger.formatMessage('error', 'fail', 'stack'),
      );
    });

    it('should write warn level messages through console.warn', () => {
      logger.warn('careful');

      expect(warnSpy).toHaveBeenCalledWith(
        logger.formatMessage('warn', 'careful'),
      );
    });

    it('should write debug level messages through console.debug', () => {
      logger.debug('details');

      expect(debugSpy).toHaveBeenCalledWith(
        logger.formatMessage('debug', 'details'),
      );
    });

    it('should write verbose level messages through console.log', () => {
      logger.verbose('verbose message');

      expect(logSpy).toHaveBeenCalledWith(
        logger.formatMessage('verbose', 'verbose message'),
      );
    });

    it('should write fatal level messages through console.error', () => {
      logger.fatal('fatal message');

      expect(errorSpy).toHaveBeenCalledWith(
        logger.formatMessage('fatal', 'fatal message'),
      );
    });
  });
});

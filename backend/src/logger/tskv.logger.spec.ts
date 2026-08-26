import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;
  let logSpy: jest.SpyInstance;
  let errorSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let debugSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new TskvLogger();
    logSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
    warnSpy = jest.spyOn(console, 'warn').mockImplementation();
    debugSpy = jest.spyOn(console, 'debug').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('formatMessage', () => {
    it('should format a flat TSKV record with tab-separated key=value fields', () => {
      const result = logger.formatMessage('log', 'hello');

      expect(result).toBe('level=log\tmessage=hello\n');
    });

    it('should stringify optionalParams as a single field', () => {
      const result = logger.formatMessage('warn', 'careful', 'OrderController');

      expect(result).toBe(
        'level=warn\tmessage=careful\toptionalParams=["OrderController"]\n',
      );
    });

    it('should stringify non-string messages as JSON', () => {
      const result = logger.formatMessage('error', { code: 404 });

      expect(result).toBe('level=error\tmessage={"code":404}\n');
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

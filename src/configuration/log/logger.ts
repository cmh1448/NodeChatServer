import winston from 'winston';
import winstonDaily from 'winston-daily-rotate-file';

const logDir = 'logs';

const logger = winston.createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp(),
    winston.format.align(),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winstonDaily({
      filename: `${logDir}/%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: 10,
    }),
    new winston.transports.Console(),
  ],
});

<<<<<<< HEAD
logger.info('Logger is initialized');

=======
>>>>>>> bb19387 (로그 Config 추가)
export default logger;

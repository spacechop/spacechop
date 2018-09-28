import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

// By default log level is set to `info`.
// Override log level by setting `LOG_LEVEL` environment variable.
// In test environment only error logs will be emitted.
const logLevel = 'LOG_LEVEL' in process.env
  ? process.env.LOG_LEVEL
  : process.env.NODE_ENV === 'test'
    ? 'error'
    : 'info';

// Rotate log file transport.
const createRotatedFileTransform = (config) => new DailyRotateFile({
  ...config,
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
});

const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp(),
    json(),
  ),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    createRotatedFileTransform({
      filename: 'error-%DATE%.log',
      level: 'warning',
    }),
    createRotatedFileTransform({
      filename: 'combined-%DATE%.log',
    }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;

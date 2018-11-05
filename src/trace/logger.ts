import winston, { format } from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const { combine, timestamp, json } = format;

const { LOG_FILE, NODE_ENV } = process.env;

// By default log level is set to `info`.
// Override log level by setting `LOG_LEVEL` environment variable.
// In test environment only error logs will be emitted.
const logLevel = 'LOG_LEVEL' in process.env
  ? process.env.LOG_LEVEL
  : (process.env.NODE_ENV === 'test' ? 'error' : 'info');

// Rotate log file transport.
const createRotatedFile = (config) => new DailyRotateFile({
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
    // Log to the `console` with the format:
    // `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    ...LOG_FILE ? [createRotatedFile({ filename: `${LOG_FILE}-%DATE%.log` })] : [],
  ],
});

export default logger;

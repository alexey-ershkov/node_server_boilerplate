import winston from 'winston';

winston.addColors({
  error: 'red',
  warn: 'yellow',
  info: 'cyan',
  debug: 'green',
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.simple(), winston.format.colorize()),
      level: 'debug',
    }),
  ],
});

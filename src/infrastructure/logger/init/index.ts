import { BaseLogger } from 'pino';

let logger: BaseLogger;

if (process.env.APP_ENV === 'client') {
  logger = require('./client').default;
} else {
  logger = require('./server').default;
}

export { logger };

/* eslint-disable no-console */

import { createLogger } from 'redux-logger';

export const logger = createLogger({
  level: 'log',
  timestamp: true,
  duration: true,
  logger: {
    log(type: string, _style: string, content: any) {
      switch (type.trim()) {
        case '%c prev state':
          if (process.env.REDUX_LOG === 'full') {
            console.log(content);
          }
          break;
        case '%c action':
          console.log('------------------');
          console.log('ACTION:  ', content.type);
          console.log(`DATE:     [${new Date().toISOString()}] `);
          break;
        case '%c next state':
          if (process.env.REDUX_LOG === 'full') {
            console.log(content);
          }
          break;
        default:
      }
    },
  },
});

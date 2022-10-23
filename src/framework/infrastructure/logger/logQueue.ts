
import { createRequest } from 'framework/infrastructure/request';
import { Queue } from 'lib/queue';

import { InfoLogParams, PerformanceLogParams, ErrorLogParams } from './types';

type QueueLogParams = { environment: 'client'; level: 'info' | 'error' | 'performance' } & (
  | ErrorLogParams
  | InfoLogParams
  | PerformanceLogParams
);

const request = createRequest({ networkTimeout: 30 * 1000 });

const action = (logParams: QueueLogParams) => {
  // @TODO set the path from the outside
  return request('/_/log', {
    method: 'post',
    data: logParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const logQueue = new Queue({ action });

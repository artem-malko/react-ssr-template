import { InfoLogParams, PerformanceLogParams, ErrorLogParams } from './types';
import { Queue } from 'lib/queue';
import { createRequest } from 'infrastructure/request';

type QueueLogParams = { environment: 'client'; level: 'info' | 'error' | 'performance' } & (
  | ErrorLogParams
  | InfoLogParams
  | PerformanceLogParams
);

const request = createRequest({ networkTimeout: 30 * 1000 });

const action = (logParams: QueueLogParams) => {
  // @TODO set the pass outside
  return request('/_/log', {
    method: 'post',
    data: logParams,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

export const logQueue = new Queue({ action });

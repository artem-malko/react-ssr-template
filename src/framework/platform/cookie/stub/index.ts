import { createMethodStubber } from 'tests/stub';

import { createCookieAPI } from '../client';

export const createStubedCookieAPI = () => {
  const stubMethod = createMethodStubber('cookie');

  return {
    get: stubMethod<ReturnType<typeof createCookieAPI>['get']>('get'),
    set: stubMethod<ReturnType<typeof createCookieAPI>['set']>('set'),
    delete: stubMethod<ReturnType<typeof createCookieAPI>['delete']>('delete'),
  };
};

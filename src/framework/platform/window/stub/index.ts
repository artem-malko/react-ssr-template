import { createMethodStubber } from 'tests/stub';

import { WindowAPI } from '../types';

export const createStubedWindowAPI = () => {
  const stubMethod = createMethodStubber('window');

  return {
    delayClose: stubMethod<WindowAPI['delayClose']>('delayClose'),
    historyBack: stubMethod<WindowAPI['historyBack']>('historyBack'),
    historyPush: stubMethod<WindowAPI['historyPush']>('historyPush'),
    historyReplace: stubMethod<WindowAPI['historyReplace']>('historyReplace'),
    open: stubMethod<WindowAPI['open']>('open'),
    reload: stubMethod<WindowAPI['reload']>('reload'),
    mocks: {},
  };
};

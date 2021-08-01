import { AnyAppContext } from '../types';

export const historyPush = () => ({
  type: 'historyPush',
  payload: {},
});

export const historyReplace = () => ({
  type: 'historyReplace',
  payload: {},
});

export const historyRedirect = () => ({
  type: 'historyRedirect',
  payload: {},
});

export const historyBack = () => ({
  type: 'historyBack',
  payload: {},
});

export const replaceState = (payload: AnyAppContext) => ({
  type: 'replaceState',
  payload,
});

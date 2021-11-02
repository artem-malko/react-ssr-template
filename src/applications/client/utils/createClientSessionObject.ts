import { defaultSession } from 'core/session/context';
import { Session } from 'core/session/types';
import { getViewportSize } from 'lib/browser';

export const createClientSessionObject = (): Session => {
  return {
    ...defaultSession,
    ...window.__session,
    screen: getViewportSize(),
  };
};

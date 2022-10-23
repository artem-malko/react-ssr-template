import { defaultSession } from 'framework/session/context';
import { Session } from 'framework/session/types';

export const createClientSessionObject = (): Session => {
  return {
    ...defaultSession,
    ...window.__session,
  };
};

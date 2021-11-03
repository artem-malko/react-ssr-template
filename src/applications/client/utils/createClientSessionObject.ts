import { defaultSession } from 'core/session/context';
import { Session } from 'core/session/types';

export const createClientSessionObject = (): Session => {
  return {
    ...defaultSession,
    ...window.__session,
  };
};

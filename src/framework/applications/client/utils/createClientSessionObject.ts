import { defaultSession } from 'framework/infrastructure/session/context';
import { Session } from 'framework/infrastructure/session/types';

export const createClientSessionObject = (): Session => {
  return {
    ...defaultSession,
    ...window.__session,
  };
};

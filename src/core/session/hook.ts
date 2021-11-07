import { useContext } from 'react';
import { SessionContext } from './context';

export const useSession = () => {
  const session = useContext(SessionContext);

  return session;
};

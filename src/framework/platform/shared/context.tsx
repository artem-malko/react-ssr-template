import { createContext, useContext } from 'react';
import { PlatformAPI } from '..';

export const PlatformAPIContext = createContext<PlatformAPI>({} as PlatformAPI);

export const usePlatformAPI = () => {
  const platformAPI = useContext(PlatformAPIContext);

  return platformAPI;
};

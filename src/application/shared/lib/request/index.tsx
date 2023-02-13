import { createContext, useContext } from 'react';

import { Requester } from 'framework/public/types';
import { createRequest } from 'framework/public/universal';

export const RequesterContext = createContext<Requester>(
  createRequest({
    // This is just a reasonable default
    networkTimeout: 10000,
  }),
);

export const useRequest = () => {
  const request = useContext(RequesterContext);

  return request;
};

import { createContext, useContext } from 'react';

import { Services } from '..';

export const ServiceContext = createContext<Services>({} as Services);

export const useServices = () => {
  const services = useContext(ServiceContext);

  return services;
};

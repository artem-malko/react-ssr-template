import { useConfig } from 'application/shared/config/hook';
import { useAppLogger } from 'framework/public/universal';

import { useRequest } from '../request';

/**
 * All useful things for any API
 */
export const useApiContext = () => {
  const config = useConfig();
  const logger = useAppLogger();
  const request = useRequest();

  return {
    config,
    logger,
    request,
  };
};

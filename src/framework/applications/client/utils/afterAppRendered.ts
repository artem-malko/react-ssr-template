import { BaseApplicationConfig } from 'framework/config/types';
import { loadAllStylesOnClient } from 'framework/infrastructure/css/loadAllStylesOnClient';
import { AppLogger } from 'framework/infrastructure/logger';
import { getFullPathForStaticResource } from 'framework/infrastructure/webpack/getFullPathForStaticResource';

type Params = {
  config: BaseApplicationConfig;
  logger: AppLogger;
};
export const afterAppRendered = ({ config, logger }: Params) => {
  loadAllStylesOnClient({
    fileName: getFullPathForStaticResource({
      chunkName: 'stylesLtr',
      staticResourcesPathMapping: window.__staticResourcesPathMapping.pathMapping,
      publicPath: config.publicPath,
      resourceType: 'css',
    }),
  });

  console.log('afterAppRendered callback executed');

  logger.sendInfoLog({
    id: 'startup-log',
    message: 'afterAppRendered callback executed',
  });
};

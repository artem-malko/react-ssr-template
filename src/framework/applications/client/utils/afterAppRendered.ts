import { BaseApplicationConfig } from 'framework/config/types';
import { loadAllStylesOnClient } from 'framework/infrastructure/css/loadAllStylesOnClient';
import { sendInfoLog } from 'framework/infrastructure/logger';
import { getFullPathForStaticResource } from 'framework/infrastructure/webpack/getFullPathForStaticResource';

export const afterAppRendered = (config: BaseApplicationConfig) => {
  loadAllStylesOnClient({
    fileName: getFullPathForStaticResource({
      chunkName: 'stylesLtr',
      staticResourcesPathMapping: window.__staticResourcesPathMapping.pathMapping,
      publicPath: config.publicPath,
      resourceType: 'css',
    }),
  });

  console.log('afterAppRendered callback executed');

  sendInfoLog({
    id: 'startup-log',
    message: 'afterAppRendered callback executed',
  });
};

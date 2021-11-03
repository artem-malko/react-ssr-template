import { ApplicationConfig } from 'config/types';
import { loadAllStylesOnClient } from 'infrastructure/css/loadAllStylesOnClient';
import { getFullPathForStaticResource } from 'infrastructure/webpack/getFullPathForStaticResource';

export const afterAppRendered = (config: ApplicationConfig) => {
  loadAllStylesOnClient({
    fileName: getFullPathForStaticResource({
      chunkName: 'stylesLtr',
      staticResourcesPathMapping: window.__staticResourcesPathMapping.pathMapping,
      publicPath: config.publicPath,
      resourceType: 'css',
    }),
  });
  console.log('afterAppRendered callback executed');
};

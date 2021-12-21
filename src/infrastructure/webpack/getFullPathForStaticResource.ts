interface Params {
  staticResourcesPathMapping: { [chunkName: string]: string[] };
  chunkName: string;
  resourceType: 'css' | 'js';
  publicPath: string;
}
export function getFullPathForStaticResource(params: Params): string {
  const { publicPath, ...extractFileNameParams } = params;
  const assetFileName = extractFileNameByResourceType(extractFileNameParams);

  return `${publicPath}${assetFileName}`;
}

export function createJSResourcePathGetter(params: {
  publicPath: string;
  staticResourcesPathMapping: { [chunkName: string]: string[] };
}) {
  const { publicPath, staticResourcesPathMapping } = params;
  return (chunkName: string) =>
    getFullPathForStaticResource({
      staticResourcesPathMapping,
      publicPath,
      resourceType: 'js',
      chunkName,
    });
}

/**
 * staticResourcesPathMapping — is an assetsByChunkName mapping from webpack
 * This function will extract certain file with selected resourceType
 *
 * Can be usefull, if the same file has `.css` and `.js` versions
 */
function extractFileNameByResourceType(params: {
  staticResourcesPathMapping: { [chunkName: string]: string[] };
  chunkName: string;
  resourceType: 'css' | 'js';
}) {
  const { staticResourcesPathMapping, chunkName, resourceType } = params;
  const assetsList = staticResourcesPathMapping[chunkName];

  if (!assetsList) {
    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(`UNKNOWN_CHUNK_NAME_${chunkName}`);
    }
    return `UNKNOWN_CHUNK_NAME_${chunkName}`;
  }

  const expectedFileName = assetsList.find(
    (assetFileName) =>
      assetFileName.indexOf(`.${resourceType}`) !== -1 &&
      assetFileName.indexOf(`.${resourceType}.map`) === -1,
  );

  if (!expectedFileName) {
    const error = `NO_COMPILED_FILENAME_FOR_${assetsList.toString()}`;

    if (process.env.NODE_ENV === 'development') {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return error;
  }

  return expectedFileName;
}

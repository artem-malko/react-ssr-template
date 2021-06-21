import { AssetsList } from 'applications/server/utils/assets';
import { extractFileNameByResourceType } from 'infrastructure/webpack/extractFileNameByResourceType';

interface Params {
  pathMapping: AssetsList;
  chunkName: string;
  resourceType: 'css' | 'js';
  publicPath: string;
}
export function getFullPath(params: Params): string {
  const { publicPath, ...extractFileNameParams } = params;
  const assetFileName = extractFileNameByResourceType(extractFileNameParams);

  return `${publicPath}${assetFileName}`;
}

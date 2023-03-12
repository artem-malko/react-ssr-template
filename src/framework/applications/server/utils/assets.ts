import fs from 'node:fs';

import {
  PAGE_DEPENDENCIES_FILE_NAME,
  ASSETS_STATS_FILE_NAME,
} from 'framework/infrastructure/webpack/constants';

export interface AssetsList {
  [chunkName: string]: string[];
}

interface StatsData {
  assetsByChunkName: AssetsList;
}
export interface AssetsData {
  pathMapping: AssetsList;
  inlineContent: string;
}

/**
 * Reads stats.json with all stats about current client build
 * Reads webpack runtime chunk
 */
export async function readAssetsInfo(): Promise<AssetsData> {
  try {
    const statsContent = await readFileContent(`${process.cwd()}/build/${ASSETS_STATS_FILE_NAME}`);
    const pathMapping = JSON.parse(statsContent).assetsByChunkName as StatsData['assetsByChunkName'];
    const webpackRuntimeCode = await readFileContent(
      `${process.cwd()}/build/public/${pathMapping['runtime']}`,
    );

    return {
      pathMapping,
      inlineContent: `${webpackRuntimeCode}`,
    };
  } catch (error) {
    console.error(error);
    throw new Error('stats.json or webpack runtime file are not ready');
  }
}

/**
 * Reads a file with all deps for each page
 */
export function readPageDependenciesStats(): Promise<{ [pageChunkName: string]: string[] }> {
  return readFileContent(`${process.cwd()}/build/${PAGE_DEPENDENCIES_FILE_NAME}`).then((content) => {
    return JSON.parse(content);
  });
}

function readFileContent(filePath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

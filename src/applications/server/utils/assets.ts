import fs from 'node:fs';

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
export function readAssetsInfo(): Promise<AssetsData> {
  const statsData = require(`./stats.json`) as StatsData;
  const pathMapping: AssetsList = statsData.assetsByChunkName;
  const webpackRuntimePath = `${process.cwd()}/build/public/${pathMapping['runtime']}`;

  return Promise.all([readFileContent(webpackRuntimePath)]).then(([webpackRuntimeCode]) => ({
    pathMapping,
    inlineContent: `${webpackRuntimeCode}`,
  }));
}

/**
 * Reads a file with all deps for each page
 */
export function readPageDependenciesStats(): Promise<{ [pageChunkName: string]: string[] }> {
  const statsData = require(`./page_dependencies.json`) as { [pageChunkName: string]: string[] };

  return Promise.resolve(statsData);
}

function readFileContent(filePath: string) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, content: string) => {
      if (err) {
        reject(err);
      } else {
        resolve(content);
      }
    });
  });
}

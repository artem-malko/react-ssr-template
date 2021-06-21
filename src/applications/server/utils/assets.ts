import fs from 'fs';

interface NamedChunkGroups {
  [chunkName: string]: {
    name: string;
    chunks: string[];
    assets: Array<{ name: string }>;
  };
}
export interface AssetsList {
  [chunkName: string]: string[];
}
interface StatsData {
  assetsByChunkName: AssetsList;
  namedChunkGroups: NamedChunkGroups;
}
export interface AssetsData {
  namedChunkGroups: NamedChunkGroups;
  pathMapping: AssetsList;
  inlineContent: string;
}

export function getAssets(): Promise<AssetsData> {
  const statsData = require('./stats.json') as StatsData;
  const pathMapping: AssetsList = statsData.assetsByChunkName;
  const webpackRuntimePath = `${process.cwd()}/build/public/${pathMapping['runtime']}`;

  return Promise.all([readFileContent(webpackRuntimePath)]).then(([webpackRuntimeCode]) => ({
    namedChunkGroups: statsData.namedChunkGroups,
    pathMapping,
    inlineContent: `${webpackRuntimeCode}`,
  }));
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

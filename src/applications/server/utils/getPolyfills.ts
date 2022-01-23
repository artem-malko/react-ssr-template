import fs from 'node:fs';
import path from 'node:path';
import { Request } from 'express';

export type PolyfillList =
  | 'intersectionObserver'
  | 'requestidlecallback'
  | 'rafPolyfill'
  | 'es6Shim'
  | 'pad';

const polyfillNameToSourceCode: { [key in PolyfillList]: string } = {
  intersectionObserver: getChunkSourceCode('intersectionObserver'),
  requestidlecallback: getChunkSourceCode('requestidlecallback'),
  es6Shim: getChunkSourceCode('es6Shim'),
  rafPolyfill: getChunkSourceCode('rafPolyfill'),
  pad: getChunkSourceCode('pad'),
};

export function getAllPolyfillsSourceCode(req: Request) {
  const polyfillsList = getPolyfillsList(req);

  return polyfillsList.reduce((acc, polyfill) => {
    const sourceCode = polyfillNameToSourceCode[polyfill];
    if (!sourceCode) {
      return acc;
    }

    return acc + `\n;${sourceCode}`;
  }, '');
}

/**
 * Reads a source code of a polyfill by its chunk name
 */
function getChunkSourceCode(chunkName: PolyfillList) {
  const assetsByChunkName = require(`./stats.json`).assetsByChunkName;
  const sourceCodePath = path.resolve(`./build/public/${assetsByChunkName[chunkName]}`);
  return fs.readFileSync(sourceCodePath, { encoding: 'utf8' });
}

function getPolyfillsList(req: Request): PolyfillList[] {
  const parsedUA = req.parsedUA;
  const mutablePolyfillsList = [] as PolyfillList[];
  const currentVersion = parseFloat(parsedUA.version);

  if (
    parsedUA.isSafari ||
    parsedUA.isIE ||
    (parsedUA.isFirefox && currentVersion < 55) ||
    (parsedUA.isChrome && currentVersion < 47) ||
    (parsedUA.isEdge && currentVersion < 76) ||
    (parsedUA.isAndroid && currentVersion < 4.4) ||
    (parsedUA.isSamsung && currentVersion < 5)
  ) {
    mutablePolyfillsList.push('requestidlecallback');
  }

  if (
    (parsedUA.isSafari && currentVersion < 12.1) ||
    (parsedUA.isFirefox && currentVersion < 55) ||
    (parsedUA.isChrome && currentVersion < 58) ||
    parsedUA.isIE ||
    (parsedUA.isEdge && currentVersion < 16) ||
    (parsedUA.isAndroid && currentVersion < 4.4) ||
    ((parsedUA.isiPad || parsedUA.isiPhone) && currentVersion < 12.3) ||
    (parsedUA.isSamsung && currentVersion < 7.2)
  ) {
    mutablePolyfillsList.push('intersectionObserver');
  }

  if (parsedUA.isIE && currentVersion < 10) {
    mutablePolyfillsList.push('rafPolyfill');
  }

  if (parsedUA.isIE) {
    mutablePolyfillsList.push('es6Shim');
  }

  if (
    (parsedUA.isChrome && currentVersion < 57) ||
    (parsedUA.isEdge && currentVersion < 15) ||
    parsedUA.isIE ||
    (parsedUA.isSafari && currentVersion < 10) ||
    (parsedUA.isFirefox && currentVersion < 48) ||
    (parsedUA.isAndroid && currentVersion < 4.4) ||
    (parsedUA.isSamsung && currentVersion < 7.2)
  ) {
    mutablePolyfillsList.push('pad');
  }

  return mutablePolyfillsList;
}

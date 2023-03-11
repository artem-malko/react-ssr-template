import { Compilation, Compiler, sources } from 'webpack';

const RawSource = sources.RawSource;
const pluginName = 'dependency-manager-plugin';

export const PAGE_DEPENDENCIES_FILE_NAME = 'page_dependencies.json';

/**
 * Returns info about deps for every page's chunk
 */
export class PageDependenciesManagerPlugin {
  public apply(compiler: Compiler) {
    // Capture the compilation and then set up further hooks.
    compiler.hooks.thisCompilation.tap(pluginName, (compilation) => {
      // Modern: `processAssets` is one of the last hooks before frozen assets.
      // I choose `PROCESS_ASSETS_STAGE_REPORT` which is the last possible
      // stage after which to emit.
      compilation.hooks.processAssets.tapPromise(
        {
          name: pluginName,
          stage: Compilation.PROCESS_ASSETS_STAGE_REPORT,
        },
        () => this.emitStats(compilation),
      );
    });
  }

  private emitStats(compilation: Compilation) {
    // Get stats.
    const statsChunks = compilation.getStats().toJson().chunks;

    if (!statsChunks) {
      throw new Error('NO CHUNKS IN STATS');
    }

    return Promise.resolve()
      .then(() => {
        const reducedStats = statsChunks.reduce<{
          chunkIdToFileNameMap: { [chunkId: string]: string };
          chunkIdToChunkName: { [chunkId: string]: string };
          chunkIdToChildrenIds: { [chunkId: string]: (string | number)[] };
        }>(
          (mutableAcc, statsChunk) => {
            if (!statsChunk.id) {
              return mutableAcc;
            }

            /**
             * Quite useless to work with initial chunks like framework or vendor
             */
            if (statsChunk.initial) {
              return mutableAcc;
            }

            /**
             * It's possible, when chunk doesn't have its own name.
             * In that case its id will be used as the name
             */
            const name = statsChunk?.names?.[0] || statsChunk.id;
            const originModuleName = statsChunk.origins?.find(
              (origin) => !!origin.moduleName,
            )?.moduleName;

            /**
             * Sometimes, dynamic import() should not be preloaded
             * For example, module A should be imported on a click event
             * Only that files, which have '_pr' or '_comp' in their name
             * will be preloaded
             */
            if (!isNeededToBePreloaded(name.toString(), originModuleName)) {
              return mutableAcc;
            }

            mutableAcc.chunkIdToChunkName[statsChunk.id] = name.toString();

            /**
             * Actually, this code has to be checked on a big codebase,
             * case I do not know a situation, when there is two JS-file for one chunk
             */
            if (statsChunk?.files?.[0]) {
              mutableAcc.chunkIdToFileNameMap[statsChunk.id] = statsChunk.files[0];
            }

            if (statsChunk.children) {
              mutableAcc.chunkIdToChildrenIds[statsChunk.id] = statsChunk.children.filter((childId) => {
                /**
                 * It's strange, but sometimes it is possible, that current chunk can have one dep
                 * in parents and in children.
                 * To prevent recursion in the next steps, we filter that ids out
                 */
                return !statsChunk.parents?.includes(childId);
              });
            }

            return mutableAcc;
          },
          {
            chunkIdToFileNameMap: {},
            chunkIdToChunkName: {},
            chunkIdToChildrenIds: {},
          },
        );

        return Object.keys(reducedStats.chunkIdToChunkName).reduce<{ [chunkName: string]: string[] }>(
          (mutableAcc, chunkId) => {
            const chunkName = reducedStats.chunkIdToChunkName[chunkId];

            // We do not collect deps for not page's chunks
            if (!chunkName || !/Page/.test(chunkName)) {
              return mutableAcc;
            }

            const mutableFiles: string[] = [];
            const pageChunkFileName = reducedStats.chunkIdToFileNameMap[chunkId];

            if (pageChunkFileName) {
              mutableFiles.push(pageChunkFileName);
            }

            const mutableChildrenIds = reducedStats.chunkIdToChildrenIds[chunkId];

            /**
             * The first level children can have its own children
             * So, let's check all of them
             */
            while (mutableChildrenIds?.length) {
              const currentChildId = mutableChildrenIds.shift();

              // currentChildId can be 0
              if (typeof currentChildId === 'undefined') {
                continue;
              }

              const innerChildrenIds = reducedStats.chunkIdToChildrenIds[currentChildId];

              if (innerChildrenIds) {
                mutableChildrenIds.push(...innerChildrenIds);
              }

              const fileName = reducedStats.chunkIdToFileNameMap[currentChildId];

              if (fileName && !mutableFiles.includes(fileName)) {
                mutableFiles.push(fileName);
              }
            }

            if (mutableFiles.length) {
              mutableAcc[chunkName] = mutableFiles;
            }

            return mutableAcc;
          },
          {},
        );
      })
      .then((result) => {
        const resultString = JSON.stringify(result, null, 2);
        const resultStringBuf = Buffer.from(resultString, 'utf-8');
        const source = new RawSource(resultStringBuf);
        const filename = `../${PAGE_DEPENDENCIES_FILE_NAME}`;

        const asset = compilation.getAsset(filename);

        if (asset) {
          compilation.updateAsset(filename, source);
        } else {
          compilation.emitAsset(filename, source);
        }
      });
  }
}

function isNeededToBePreloaded(name: string, originModuleName: string | undefined): boolean {
  /**
   * _sk_pr in the name means, that current file is not intended to be preloaded
   */
  if (name.includes('__sk__pr__')) {
    return false;
  }

  /**
   * _pr in the name means, that current file is intended to preload
   */
  if (name.includes('__pr__')) {
    return true;
  }

  /**
   * tsx in the end of the originModuleName means, that current file is intended to be preload,
   * cause it is a component's js-code
   */
  if (originModuleName?.endsWith('tsx')) {
    return true;
  }

  return false;
}

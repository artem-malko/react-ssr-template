import { BannerPlugin, EntryObject } from 'webpack';

/**
 * This plugin and entries allow to use of pino v7 with webpack generated bundle files.
 * More details here: https://www.npmjs.com/package/pino-webpack-plugin
 */

export const pinoEntries: EntryObject = {
  'thread-stream-worker': {
    import: './node_modules/thread-stream/lib/worker.js',
    library: {
      type: 'commonjs2',
    },
  },
  'pino-file': {
    import: './node_modules/pino/file.js',
    library: {
      type: 'commonjs2',
    },
  },
  'pino-worker': {
    import: './node_modules/pino/lib/worker.js',
    library: {
      type: 'commonjs2',
    },
  },
  'pino-pipeline-worker': {
    import: './node_modules/pino/lib/worker-pipeline.js',
    library: {
      type: 'commonjs2',
    },
  },
  'pino-pretty': {
    import: './node_modules/pino-pretty/index.js',
    library: {
      type: 'commonjs2',
    },
  },
};

export const pinoBannerPlugin = new BannerPlugin({
  banner: `
  /* Start of pino-webpack-plugin additions */
  function pinoWebpackAbsolutePath(p) {
    return require('path').join(__dirname, p)
  }
  globalThis.__bundlerPathsOverrides = {'pino/file': pinoWebpackAbsolutePath('./pino-file.js'),'pino-worker': pinoWebpackAbsolutePath('./pino-worker.js'),'pino-pipeline-worker': pinoWebpackAbsolutePath('./pino-pipeline-worker.js'),'pino-pretty': pinoWebpackAbsolutePath('./pino-pretty.js'),'thread-stream-worker': pinoWebpackAbsolutePath('./thread-stream-worker.js')};
  /* End of pino-webpack-bundler additions */
  `,
  raw: true,
  entryOnly: true,
});

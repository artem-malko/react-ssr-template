import path from 'path';

import esbuild from 'esbuild';
import webpack from 'webpack';

import { PAGE_DEPENDENCIES_FILE_NAME } from './plugins/dependencyManager/plugin';
import { universalConfig } from './universal';
import { merge } from './utils/merge';
import { pinoBannerPlugin, pinoEntries } from './utils/pino';
import { ASSETS_STATS_FILE_NAME } from '../src/framework/infrastructure/webpack/stats';

const isProduction = process.env.NODE_ENV === 'production';

const serverConfig: webpack.Configuration = {
  entry: {
    server: './src/application/entry/server/index.tsx',
    ...pinoEntries,
  },

  output: {
    path: path.resolve('./build'),
    filename: '[name].js',
    assetModuleFilename: '[hash][ext][query]',
  },

  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              implementation: esbuild,
              loader: 'tsx',
              target: 'node19',
              jsx: 'automatic',
              tsconfigRaw: require('../tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /\.(png|jpg)$/,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: 'server',
    }),
    pinoBannerPlugin,
  ],

  cache: {
    name: `${process.env.NODE_ENV}_server`,
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  optimization: {
    minimize: false,
  },

  devtool: false,

  target: 'node',

  /**
   * Client-side builder creates some stats files.
   * These files have some info about client build, its files.
   * This info can be used somewhere on the server-side.
   * For example, for reading webpack runtime and so on.
   */
  externals: [
    { [`./${ASSETS_STATS_FILE_NAME}`]: `commonjs ./${ASSETS_STATS_FILE_NAME}` },
    { [`./${PAGE_DEPENDENCIES_FILE_NAME}`]: `commonjs ./${PAGE_DEPENDENCIES_FILE_NAME}` },
  ],
};

export default isProduction
  ? merge(universalConfig, serverConfig, { mode: 'production' })
  : merge(
      universalConfig,
      serverConfig,
      {
        plugins: [
          new webpack.EvalSourceMapDevToolPlugin({
            exclude: /pino/,
            noSources: true,
          }),
        ],
      },
      { mode: 'development' },
    );

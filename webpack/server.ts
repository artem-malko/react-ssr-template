import path from 'path';
import webpack from 'webpack';
import { universalConfig } from './universal';
import { merge } from 'webpack-merge';
import esbuild from 'esbuild';
import { ASSETS_STATS_FILE_NAME } from '../src/infrastructure/webpack/stats';
import { PAGE_DEPENDENCIES_FILE_NAME } from '../src/infrastructure/dependencyManager/webpack/plugin';

const isProduction = process.env.NODE_ENV === 'production';

const serverConfig: webpack.Configuration = {
  entry: './src/applications/server/index.ts',

  output: {
    path: path.resolve('./build'),
    filename: 'server.js',
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
              target: 'node14',
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

  target: 'node',

  /**
   * Client-side builder creates some stats files.
   * These files have some info about client build, its files.
   * This info can be used somewhere on the server-side.
   * For example, for reading webpack runtime, polyfills and so on.
   */
  externals: [
    { [`./${ASSETS_STATS_FILE_NAME}`]: `commonjs ./${ASSETS_STATS_FILE_NAME}` },
    { [`./${PAGE_DEPENDENCIES_FILE_NAME}`]: `commonjs ./${PAGE_DEPENDENCIES_FILE_NAME}` },
  ],
};

export default isProduction
  ? merge(universalConfig, serverConfig, { mode: 'production' })
  : merge(universalConfig, serverConfig, { mode: 'development' });

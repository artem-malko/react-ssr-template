import path from 'node:path';

import esbuild from 'esbuild';
import webpack from 'webpack';

import { universalConfig } from './universal';
import { merge } from './utils/merge';
import { pinoBannerPlugin, pinoEntries } from './utils/pino';
import { isProduction } from './utils/isProduction';

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
};

export default isProduction()
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

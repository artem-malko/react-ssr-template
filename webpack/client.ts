import path from 'node:path';

import esbuild from 'esbuild';
import TerserPlugin from 'terser-webpack-plugin';
import webpack from 'webpack';

import { RootChunkDependenciesManagerPlugin } from './plugins/dependencyManager/plugin';
import { universalConfig } from './universal';
import { merge } from './utils/merge';
import { isProduction } from './utils/isProduction';
import { CSSInJSPlugin } from '../src/framework/infrastructure/css/webpack/plugin';
import {
  ASSETS_STATS_FILE_NAME,
  PAGE_DEPENDENCIES_FILE_NAME,
} from '../src/framework/infrastructure/webpack/constants';

// eslint-disable-next-line no-duplicate-imports
import type { TransformOptions as EsbuildOptions } from 'esbuild';

const CompressionPlugin = require('compression-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const LiveReloadPlugin = require('webpack-livereload-plugin');
const WebpackNpmDependenciesAnalyzer = require('webpack-npm-dependencies-analyzer');
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

const withBundleStats = process.env.BUNDLE_STATS === 'true';
const bundleStatsPlugins = withBundleStats
  ? [
      // Collect bundle info
      new BundleAnalyzerPlugin(),
    ]
  : [];

const clientConfig: webpack.Configuration = {
  entry: {
    // The main entry point
    app: './src/application/entry/client/index.tsx',
  },

  output: {
    path: path.resolve('./build/public'),
    publicPath: '/public/',
    filename: '[name].[contenthash].js',
    chunkFilename: '[name].[contenthash].js',
    assetModuleFilename: '[hash][ext][query]',
    crossOriginLoading: 'anonymous',
    chunkLoadTimeout: 5000,
  },

  module: {
    rules: [
      {
        test: /\.ts(x)?$/,
        exclude: /node_modules|css\.ts/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              implementation: esbuild,
              target: 'es6',
              jsx: 'automatic',
              tsconfigRaw: require('../tsconfig.json'),
            },
          },
        ],
      },
      {
        test: /css\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(
              __dirname,
              '..',
              'src/framework/infrastructure/css/webpack/loader/index.ts',
            ),
            options: {
              resolveModules: universalConfig.resolve!.modules,
              aliases: universalConfig.resolve!.alias,
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              implementation: esbuild,
              format: 'cjs',
              loader: 'ts',
              target: 'es6',
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

  cache: {
    name: `${process.env.NODE_ENV}_client`,
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },

  optimization: {
    runtimeChunk: {
      name: 'runtime',
    },

    // @TODO something wrong with deteremenistic, no cache update while development
    moduleIds: 'hashed',

    splitChunks: {
      cacheGroups: {
        infrastructure: {
          name: 'framework',
          test: /framework/,
          chunks: 'all',
          enforce: true,
        },
        lib: {
          name: 'lib',
          test: /src\/lib/,
          chunks: 'all',
          enforce: true,
        },
        // @TODO https://webpack.js.org/configuration/entry-context/#dependencies
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          enforce: true,
          chunks: 'all',
          name(module: any) {
            // get the name. E.g. node_modules/packageName/not/this/part.js
            // or node_modules/packageName
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

            switch (packageName) {
              case 'react':
              case 'react-dom':
              case 'scheduler':
              case 'object-assign':
                return 'react';
              case 'path-to-regexp':
              case 'uuid':
                return 'rarely';
              default:
                return 'vendor';
            }
          },
        },
      },
    },
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      APP_ENV: 'client',
    }),

    new CSSInJSPlugin({
      useRTL: false,
      ltrChunkName: 'stylesLtr',
      rtlChunkName: 'stylesRtl',
    }),

    new RootChunkDependenciesManagerPlugin({
      isRootChunk: (webpackChunkName) => /Page/.test(webpackChunkName),
      filename: `../${PAGE_DEPENDENCIES_FILE_NAME}`,
    }),

    // Store connection between chunks and bundles and their names
    new StatsWriterPlugin({
      filename: `../${ASSETS_STATS_FILE_NAME}`,
    }),
    new WebpackNpmDependenciesAnalyzer({
      filename: '../res.json',
      packageJsonPath: './package.json',
    }),
  ],
};

const devConfig: webpack.Configuration = {
  mode: 'development',

  plugins: [
    ...bundleStatsPlugins,

    // Enable the simplest livereload in a browser (without HMR)
    new LiveReloadPlugin({
      // We need such delay cause nodemon has its own delay
      // and it needs some time to restart the server
      delay: 450,
      useSourceHash: true,
      appendScriptTag: true,
    }),
  ],

  devtool: 'inline-source-map',
};

const prodConfig: webpack.Configuration = {
  mode: 'production',

  optimization: {
    concatenateModules: true,
    minimizer: [
      new TerserPlugin<EsbuildOptions>({
        minify: TerserPlugin.esbuildMinify,
        terserOptions: {
          minify: true,
          sourcemap: false,
          legalComments: 'none',
          treeShaking: true,
        },
      }),
    ],
  },

  plugins: [
    new CompressionPlugin({
      test: /\.(js|css|svg|png|jpg|woff|woff2)$/,
      filename: '[path][base].br',
      algorithm: 'brotliCompress',
    }),
    new CompressionPlugin({
      test: /\.(js|css|svg|png|jpg|woff|woff2)$/,
      filename: '[path][base].gz',
      algorithm: 'gzip',
    }),
    ...bundleStatsPlugins,
  ],
};

export default isProduction()
  ? merge(universalConfig, clientConfig, prodConfig)
  : merge(universalConfig, clientConfig, devConfig);

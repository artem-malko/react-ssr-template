import path from 'node:path';
import webpack from 'webpack';
import { universalConfig } from './universal';
import TerserPlugin from 'terser-webpack-plugin';
import type { TransformOptions as EsbuildOptions } from 'esbuild';
import esbuild from 'esbuild';
import { CSSInJSPlugin } from '../src/infrastructure/css/webpack/plugin';
import { PageDependenciesManagerPlugin } from '../src/infrastructure/dependencyManager/webpack/plugin';
import { ASSETS_STATS_FILE_NAME } from '../src/infrastructure/webpack/stats';
import { merge } from './utils/merge';

const WebpackNpmDependenciesAnalyzer = require('webpack-npm-dependencies-analyzer');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
const CompressionPlugin = require('compression-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';
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
    app: './src/applications/client/index.tsx',

    // Polyfills
    intersectionObserver: './src/polyfills/intersectionObserver.js',
    requestidlecallback: './src/polyfills/requestidlecallback.js',
    rafPolyfill: './src/polyfills/raf.js',
    es6Shim: './src/polyfills/es6shim.js',
    pad: './src/polyfills/pad.js',
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
              loader: 'tsx',
              target: 'es6',
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
            loader: path.resolve(__dirname, '..', 'src/infrastructure/css/webpack/loader/index.ts'),
            options: {
              resolveModules: universalConfig.resolve!.modules,
            },
          },
          {
            loader: 'esbuild-loader',
            options: {
              implementation: esbuild,
              format: 'cjs',
              loader: 'ts',
              target: 'es6',
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

    moduleIds: 'hashed',

    splitChunks: {
      minChunks: 2,
      minSize: 30000,

      cacheGroups: {
        infrastructure: {
          name: 'infrastructure',
          test: /infrastructure/,
          chunks: 'all',
          enforce: true,
        },
        lib: {
          name: 'lib',
          test: /lib/,
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
              case 'axios':
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

    new CSSInJSPlugin(),

    new PageDependenciesManagerPlugin(),

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

  plugins: [...bundleStatsPlugins],

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

export default isProduction
  ? merge(universalConfig, clientConfig, prodConfig)
  : merge(universalConfig, clientConfig, devConfig);

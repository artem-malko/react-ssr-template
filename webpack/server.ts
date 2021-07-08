import path from 'path';
import webpack from 'webpack';
import { universalConfig } from './universal';
import { merge } from 'webpack-merge';

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
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                module: 'esnext',
                target: 'es2018',
                jsx: isProduction ? 'react-jsx' : 'react-jsxdev',
              },
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

  externals: [{ './stats.json': 'commonjs ./stats.json' }],
};

export default isProduction
  ? merge(universalConfig, serverConfig, { mode: 'production' })
  : merge(universalConfig, serverConfig, { mode: 'development' });

import path from 'node:path';

import webpack from 'webpack';

export const universalConfig: webpack.Configuration = {
  resolve: {
    modules: ['../node_modules', path.resolve(__dirname, '..', 'src')],
    alias: {
      lib: path.resolve(__dirname, '..', 'src/lib'),
      framework: path.resolve(__dirname, '..', 'src/framework'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),
      'process.env.SERVER_UTILITY_ROUTER_PATH': JSON.stringify(process.env.SERVER_UTILITY_ROUTER_PATH),
      'process.env.APPLICATION_CONTAINER_ID': JSON.stringify(process.env.APPLICATION_CONTAINER_ID),
    }),

    // It is necessary, cause esbuild-loader does not support React's new JSX transform
    // So, we can not write something like this: import React from 'react'; while using raw esbuild-loader
    // To fix the problem we can provide React via webpack.ProvidePlugin
    // https://github.com/privatenumber/esbuild-loader/issues/184
    new webpack.ProvidePlugin({
      React: 'react',
    }),
  ],
};

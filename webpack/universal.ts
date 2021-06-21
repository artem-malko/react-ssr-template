import path from 'path';
import webpack from 'webpack';

export const universalConfig: webpack.Configuration = {
  resolve: {
    modules: ['../node_modules', path.resolve(__dirname, '..', 'src')],
    extensions: ['.ts', '.tsx', '.js'],
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.APP_VERSION': JSON.stringify(process.env.APP_VERSION),
    }),
  ],
};

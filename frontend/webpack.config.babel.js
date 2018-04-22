import path from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import Dotenv from 'dotenv-webpack'

import FEConfig from './package.json'
import BEConfig from '../package.json'

const isInWebpackEnv = (variable) => {
  return process.argv.some((arg) => {
    return arg === `--env.${variable}`
  })
}

const isDevelopment = isInWebpackEnv('dev')

export default {
  mode: isDevelopment ? 'development' : 'production',
  entry: './index.js',
  output: {
    path: path.resolve('./dist'),
    filename: isDevelopment ? '[name].bundle.js' : '[name].min.js',
    sourceMapFilename: '[name].min.js.map',
  },
  devtool: isDevelopment ? 'cheap-module-eval-source-map' : 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'cache-loader',
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: '.babelCache',
            },
          } ],
        // NOTE: We exclude all node_modules/* from being transpiled by babel
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
              sourceMap: true,
              importLoaders: 1,
              localIdentName: '[name]--[local]--[hash:base64:8]',
            },
          },
          'postcss-loader',
        ],
      },
      {
        test: /\.(ttf|eot|woff|woff2|svg|png)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/views/index.html',
      title: `Portion Tracker${isDevelopment ? ' - v. ' + FEConfig.version : ''}`,
      data: {
        environment: isDevelopment ? 'development' : 'production',
        version: FEConfig.version,
        backendVersion: BEConfig.version,
      },
    }),
    new Dotenv({
      path: path.join(__dirname, '..', '.env'),
    }),
  ],
  node: {
    fs: 'empty',
  },
}

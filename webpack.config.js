'use strict';
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isDevelopment = !process.env.production;
const isProduction = process.env.production;
const baseDir = path.join(__dirname);
const distPath = path.join(baseDir, '/dist');

const extractSass = new ExtractTextPlugin({
  filename: 'main.css',
  disable: isDevelopment
});

const config = {
  entry: {
    'bundle.js': path.join(baseDir, '/src/main')
  },
  output: {
    path: distPath,
    filename: "[name]"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
      }]
    }, {
      test: /\.s?css$/,
      exclude: [/node_modules/],
      use: extractSass.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            minimize: isProduction
          }
        },
          'resolve-url-loader',
          'sass-loader'
        ]
      })
    }, {
      test: /\.(gif|png|jpe?g|svg)$/i,
      use: [{
        loader: 'file-loader',
        options: {
          name: 'static/images/' + (isDevelopment ? '[name]' : '[hash]') + '.[ext]'
        }
      }],
    }, {
      test: /\.(eot|ttf|woff|woff2)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/fonts/' + (isDevelopment ? '[name]' : '[hash]')  + '.[ext]'
        }
      },
    }]
  },
  plugins: [
    extractSass,
    new CopyWebpackPlugin([{
      from: 'static',
      to: 'static'
    }]),
    new HtmlWebpackPlugin({
      template: path.join(baseDir,'/index.html')
    })
  ],
  devServer: {
    contentBase: distPath,
    compress: true,
    open: true,
    port: 3000,
    historyApiFallback: true
  }
};

if (isProduction) {
  config.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_console: true,
        unsafe: false
      }
    })
  );
}

module.exports = config;


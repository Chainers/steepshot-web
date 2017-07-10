const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.join(__dirname, 'src', 'main.js'),
  output: {
    path: path.resolve(__dirname, "public"),
    filename: 'bundle.js',
  },
  module: {
    rules: [
        { 
          test: /\.js$/, 
          exclude: /node_modules/,
          use: [
              "react-hot-loader", 
              "babel-loader"
            ] 
        },
        {
            test: /\.scss$/,
            loader: ExtractTextPlugin.extract({
                use: [ 
                    { loader: 'css-loader' },
                    { loader: 'style-loader' },
                    { loader: 'resolve-url' },
                    { loader: 'sass-loader' }
                ]
            })
        },
        {
            test: /\.css$/,
            loader: ExtractTextPlugin.extract({
                use: [ 
                    { loader: 'css-loader' },
                    { loader: 'style-loader' } 
                ]
            })
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: [
            'file-loader'
          ]
        }
    ],
  },
  plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new CopyWebpackPlugin([
            { from: './src/images/**/*', to: '/public/images' },
            { from: './src/styles/**/*', to: '/public/styles' }
        ])
  ]
};
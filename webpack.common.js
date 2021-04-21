const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  mode: 'development',
  entry: 
  {
    app: './src/scripts/app.js',
  },
  module: {
    rules: [ {
      test: /\.txt$/, use: 'raw-loader' 
    },
    {
      test: /\.css$/i,
      use: ['style-loader', 'css-loader'],
    }],
  },
  plugins: [new HtmlWebpackPlugin({ title: 'Production', template: './index.html' },new BundleAnalyzerPlugin())],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
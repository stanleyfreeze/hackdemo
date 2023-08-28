const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          'babel-loader',
        ]
      }
    ]},
  devServer: {
    host: "localhost",
    port: 8080,
    open: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'popup',
      filename: 'popup.html',
      template: 'public/popup.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '../style/[name].css',
    }),
    new CssMinimizerPlugin(),
  ],
});

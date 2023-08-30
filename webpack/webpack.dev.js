const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: false,
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../style/[name].css',
    }),
    new CssMinimizerPlugin(),
  ],
});

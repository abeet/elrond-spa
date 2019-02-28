var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: [
    __dirname + '/src/elrond-spa.js',
  ],
  output: {
    path: __dirname + '/lib',
    filename: 'elrond-spa.js',
    library: 'elrondSpa',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  devtool: 'source-map',
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: 'babel-loader',
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(['lib'], {
      verbose: true,
    })
  ],
}

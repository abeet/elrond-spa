module.exports = {
  entry: __dirname + '/webpack2.spec.js',
  output: {
    path: __dirname + '/../bundles',
    filename: 'webpack2.spec.build.js',
    publicPath: '/base/spec/bundles/',
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        query: {
          presets: ['latest']
        }
      }
    ],
  },
};

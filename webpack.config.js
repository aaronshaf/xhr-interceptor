module.exports = {
  entry: {
    index: [
      'babel/polyfill',
      './index.es6.js',
    ]
  },
  output: {
    path: './dist',
    publicPath: '/',
    filename: '[name].js'
  },
  devtool: '#source-map',
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel?stage=1' }
    ]
  },
  devServer: {
    contentBase: 'dist/',
    host: 'localhost',
    inline: true
  }
}


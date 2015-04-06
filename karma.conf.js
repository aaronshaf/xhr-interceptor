var webpackConfig = require('./webpack.config')

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['mocha'],
    files: [
      'node_modules/babel-core/browser-polyfill.js',
      'test/**/*.spec.js'
    ],
    exclude: [],
    preprocessors: {
      'test/**/*.spec.js': [ 'webpack', 'sourcemap' ]
    },
    webpack: {
      cache: true,
      debug: true,
      // devtool: '#source-map',
      module: {
        loaders: webpackConfig.module.loaders.concat([
          { test: /sinon/, loader: 'imports?define=>false' }
        ])
      },
      cssnext: webpackConfig.cssnext,
      formatMessage: webpackConfig.formatMessage
    },
    proxies: {
      '/svg/': '/base/assets/svg/',
      '/img/': '/base/assets/img/'
    },
    webpackServer: {
      quiet: true,
      stats: {
        colors: true
      }
    },
    reporters: [ 'dots' ],
    port: 9876,
    colors: true,
    autoWatch: false,
    singleRun: true,
    browsers: ['Chrome'],
    captureTimeout: 120000,
    browserNoActivityTimeout: 120000,
    plugins: [
      require('karma-mocha'),
      require('karma-chrome-launcher'),
      require('karma-sourcemap-loader'),
      require('karma-webpack')
    ]
  })
}


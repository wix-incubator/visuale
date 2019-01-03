const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const WriteFilePlugin = require('write-file-webpack-plugin');

const host = 'localhost';
const port = 3001;
const customPath = path.join(__dirname, './customPublicPath');
const hotScript = 'webpack-hot-middleware/client?path=__webpack_hmr&dynamicPublicPath=true';

const baseDevConfig = () => ({
  devtool: 'eval-cheap-module-source-map',
  entry: {
    todoapp: [hotScript, customPath, path.join(__dirname, '../chrome/extension/todoapp')],
    background: [hotScript, customPath, path.join(__dirname, '../chrome/extension/background')],
  },
  // devMiddleware: {
  //   publicPath: `http://${host}:${port}/js`,
  //   stats: {
  //     colors: true
  //   },
  //   noInfo: true,
  //   headers: { 'Access-Control-Allow-Origin': '*' }
  // },
  // hotMiddleware: {
  //   path: '/js/__webpack_hmr'
  // },
  output: {
    path: path.join(__dirname, '../dev/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.prod$/),
    new webpack.DefinePlugin({
      __HOST__: `'${host}'`,
      __PORT__: port,
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new WriteFilePlugin({log: false, exitOnErrors: false, useHashIndex: false})
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [{
      test: /\.[jt]sx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer]
          }
        }
      ]
    }]
  }
});

const injectPageConfig = baseDevConfig();
injectPageConfig.entry = [
  customPath,
  path.join(__dirname, '../chrome/extension/inject')
];
delete injectPageConfig.hotMiddleware;
delete injectPageConfig.module.rules[0].options;
injectPageConfig.plugins.shift(); // remove HotModuleReplacementPlugin
injectPageConfig.output = {
  path: path.join(__dirname, '../dev/js'),
  filename: 'inject.bundle.js',
};

const contentScriptConfig = baseDevConfig();
contentScriptConfig.entry = [
  customPath,
  path.join(__dirname, '../chrome/extension/contentScript.jsx')
];
delete contentScriptConfig.hotMiddleware;
delete contentScriptConfig.module.rules[0].options;
contentScriptConfig.plugins.shift(); // remove HotModuleReplacementPlugin
contentScriptConfig.output = {
  path: path.join(__dirname, '../dev/js'),
  filename: 'contentScript.bundle.js',
};

const appConfig = baseDevConfig();

module.exports = [
  injectPageConfig,
  contentScriptConfig,
  appConfig
];

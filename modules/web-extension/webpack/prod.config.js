const path = require('path');
const webpack = require('webpack');
const autoprefixer = require('autoprefixer');

const customPath = path.join(__dirname, './customPublicPath');

module.exports = {
  entry: {
    todoapp: [customPath, path.join(__dirname, '../chrome/extension/todoapp')],
    background: [customPath, path.join(__dirname, '../chrome/extension/background')],
    inject: [customPath, path.join(__dirname, '../chrome/extension/inject')],
    contentScript: [customPath, path.join(__dirname, '../chrome/extension/contentScript.jsx')]
  },
  output: {
    path: path.join(__dirname, '../build/js'),
    filename: '[name].bundle.js',
    chunkFilename: '[id].chunk.js'
  },
  plugins: [
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.IgnorePlugin(/[^/]+\/[\S]+.dev$/),
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],
  resolve: {
    extensions: ['*', '.js']
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/,
      query: {
        presets: ['react-optimize']
      }
    }, {
      test: /\.css$/,
      use: [
        'style-loader',
        'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
        {
          loader: 'postcss-loader',
          options: {
            plugins: () => [autoprefixer]
          }
        }
      ]
    }]
  }
};

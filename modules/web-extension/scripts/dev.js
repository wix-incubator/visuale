const tasks = require('./tasks');
const createWebpackServer = require('webpack-httpolyglot-server');
const devConfig = require('../webpack/dev.config');
const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');

tasks.replaceWebpack();
console.log('[Copy assets]');
console.log('-'.repeat(80));
tasks.copyAssets('dev');

console.log('[Webpack Dev]');
console.log('-'.repeat(80));
console.log('If you\'re developing Inject page,');
console.log('please allow `https://localhost:3001` connections in Google Chrome,');
console.log('and load unpacked extensions with `./dev` folder. (see https://developer.chrome.com/extensions/getstarted#unpacked)\n');
// createWebpackServer(devConfig, {
//   host: 'localhost',
//   port: 3001
// });

const compiler = webpack(devConfig);

const server = new WebpackDevServer(compiler, {
  hot: true
});
server.listen(3001);

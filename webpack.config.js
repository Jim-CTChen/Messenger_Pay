const path = require('path');
module.exports = {
  entry: './src/server.js',
  output: {
    filename: 'index.bundle.js',
    path: path.resolve(__dirname, './src/'),
  }
};
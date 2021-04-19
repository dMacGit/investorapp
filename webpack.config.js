const path = require('path');

module.exports = {
  entry: './src/scripts/app.js',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
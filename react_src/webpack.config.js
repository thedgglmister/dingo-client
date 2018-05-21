var path = require('path');
var webpack = require('webpack');
module.exports = {
  entry: './src/dingo-redux-app.jsx',
  output: {
    path: path.resolve(__dirname, '../www/js'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        resolve: {
          extensions: ['.js', '.jsx'],
        },
        loader: 'babel-loader',
        query: {
          presets: ['env', 'react']
        }
      }
    ]
  },
  mode: 'development',
  watch: true,
};

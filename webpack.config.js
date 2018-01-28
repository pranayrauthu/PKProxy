const path = require('path');
module.exports = {
  entry: path.join(__dirname, 'src', 'options', 'Index'),
  output: {
    filename: 'options.min.js',
    path: path.resolve(__dirname, 'src', 'built')
  },
  module: {
    rules: [{
      test: /.jsx?$/,
      include: [
        path.resolve(__dirname, 'src')
      ],
      exclude: [
        path.resolve(__dirname, 'node_modules'),
        path.resolve(__dirname, 'bower_components')
      ],
      loader: 'babel-loader',
      query: {
        presets: ['es2015']
      }
    }]
  },
  resolve: {
    extensions: ['.json', '.js', '.jsx', '.css']
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, "src"),
    port: 9000
  }
};
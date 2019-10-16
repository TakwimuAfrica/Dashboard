const defaultConfig = require('./node_modules/@wordpress/scripts/config/webpack.config.js');

module.exports = {
  ...defaultConfig,
  module: {
    rules: [
      {
        use: ['babel-loader']
      },
      {
        test: /\.css$/i,
        use: ['css-loader']
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: ['url-loader']
      }
    ]
  },
  resolve: { 
    symlinks: true,
    modules: ['node_modules'],
  }
};

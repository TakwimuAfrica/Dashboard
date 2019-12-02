const defaultConfig = require('@wordpress/scripts/config/webpack.config.js');

module.exports = {
  ...defaultConfig,
  plugins: [
    // Override remove wp-scripts plugin that detaches dependencies
  ],
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
    symlinks: false,
    modules: ['node_modules']
  }
};

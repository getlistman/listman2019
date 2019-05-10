const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')

module.exports = {
  
  mode: 'development', // production
  
  output: {
    path: path.resolve(__dirname, '../dist/bundle'),
    publicPath: '/dist/bundle',
    filename: '[name].js'
  },
  
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        use: [
          'vue-style-loader',
          'css-loader',
          'sass-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ]
}

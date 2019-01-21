const merge = require('webpack-merge')
const baseConfig = require('./webpack.base.config.js')
const nodeExternals = require('webpack-node-externals')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')

module.exports = merge(baseConfig, {
  
  entry: './src/entry-server.js',
  
  target: 'node',
  
  output: {
    libraryTarget: 'commonjs2'
  },
  
  resolve: {
    alias: {
      'api': './api/api-server.js'
    }
  },
  
  externals: nodeExternals({
    whitelist: /\.css$/
  }),
  
  plugins: [
    new VueSSRServerPlugin()
  ]
  
})

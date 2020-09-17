const path = require('path')
const webpackMerge = require('webpack-merge')
const baseConfig = require('./webpack.base')

module.exports = webpackMerge.merge(baseConfig, {
  target: 'node',
  //应用入口
  entry: {
    app: path.join(__dirname, "../client/server-entry.js")
  },
  output: {
    //哈希值，命中缓存
    filename: 'server-entry.js',
    libraryTarget: 'commonjs2'
  }
})

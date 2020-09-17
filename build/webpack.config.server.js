const path = require('path')

module.exports = {
  target: 'node',
  //应用入口
  entry: {
    app: path.join(__dirname, "../client/server-entry.js")
  },
  output: {
    //哈希值，命中缓存
    filename: 'server-entry.js',
    path: path.join(__dirname, '../dist'),
    //静态资源引用时的路径，区分url是否为静态资源，配置路由更方便
    publicPath: '/public',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /.jsx$/,
      loader: 'babel-loader'
    }, {
      test: /.js$/,
      loader: 'babel-loader',
      exclude: [
        path.join(__dirname, '../node_modules')
      ]
    }]
  }
}
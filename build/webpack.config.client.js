const path = require('path')
const webpack = require('webpack')
const HTMLPlugin = require('html-webpack-plugin')

//在json里配置
const isDev = process.env.NODE_ENV === 'development'

const config = {
  //应用入口
  entry: {
    app: path.join(__dirname, "../client/app.js")
  },
  output: {
    //哈希值，命中缓存
    filename: '[name].[hash].js',
    path: path.join(__dirname, '../dist'),
    //静态资源引用时的路径，区分url是否为静态资源，配置路由更方便
    publicPath: '/public/'
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
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, "../client/index.html")
    })
  ]
}

//localhost:8888
if (isDev) {
  config.entry = {
    //客户端热更新所需
    app: ['react-hot-loader/patch', path.join(__dirname, "../client/app.js")]
  }
  config.devServer = {
    //本地，localhost，ip，127.0.0.1都可
    host: '0.0.0.0',
    port: '8888',
    //在dist目录下启动
    contentBase: path.join(__dirname, '../dist'),
    hot: true,
    //在浏览器显示错误信息
    overlay: {
      errors: true
    },
    //访问静态路径加了public
    publicPath: '/public/',
    //指定index，映射到dist，404则返回这个html
    historyApiFallback: {
      index: "/public/index.html"
    }
    //如果启动失败了，则删除dist
  }
  config.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = config
const axios = require('axios')
const path = require('path')
const webpack = require('webpack')
const serverConfig = require('../../build/webpack.config.server')
const MemoryFs = require('memory-fs')
const ReactDomServer = require('react-dom/server')
const { createProxyMiddleware } = require('http-proxy-middleware')

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get("http://localhost:8888/public/index.html")
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  })
}

const Module = module.constructor

const mfs = new MemoryFs
  //监听webpack配置变化
const serverCompiler = webpack(serverConfig)
serverCompiler.outputFileSystem = mfs
let serverBundle
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.error(err))
  stats.warnings.forEach(warn => console.warn(warn))

  const bundlePath = path.join(serverConfig.output.path, serverConfig.output.filename)
    //npm i memory-fs -D，从内存读写模块不是硬盘
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
    //此时读入的文件还都是字符串，而不是模块
  const m = new Module()
  m._compile(bundle, 'server-entry.js')
  serverBundle = m.exports.default
})

module.exports = function(app) {
  app.use("/public", createProxyMiddleware({
    target: "http://localhost:8888"
  }))
  app.get('*', function(req, res) {
    getTemplate().then(template => {
      const content = ReactDomServer.renderToString(serverBundle)
      res.send(template.replace('<!-- app -->', content))
    })
  })
}

//serverCompiler可行，webpack提供一个在nodejs作为模块调用的方式而不仅仅是命令行工具
//为什么要引入这个模块并监听这个打包过程，需要拿到到打包出来的内容，mfs加快读取速度，赋值方式 outputFileSystem
//输出的是字符串，模块化的操作，一个hack操作，new一个module，然后compile输出的字符串
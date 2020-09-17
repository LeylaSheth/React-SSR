const express = require('express')
const favicon = require('serve-favicon')
const ReactSSR = require('react-dom/server')
const fs = require('fs')
const path = require('path')

const isDev = process.env.NODE_ENV === 'development'

const app = express()

app.use(favicon(path.join(__dirname, "../favicon.ico")))

if (!isDev) {
  const serverEntry = require('../dist/server-entry').default
    //同步读取
  const template = fs.readFileSync(path.join(__dirname, "../dist/index.html"), 'utf-8')
    //public下的静态文件，即渲染静态文件，webpack内配置了public路径，映射到dist
  app.use('/public', express.static(path.join(__dirname, '../dist')))

  app.get('*', function(req, res) {
    const appString = ReactSSR.renderToString(serverEntry)
      //请求发送模板html替换过的内容，返回服务端渲染的代码
    res.send(template.replace('<!-- app -->', appString))
  })
} else {
  const devStatic = require('./utils/dev-static')
  devStatic(app)
}

app.listen(3000, function() {
  console.log("It's running on http://localhost:3000")
})

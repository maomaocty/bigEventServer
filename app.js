const path = require('path')
const express = require('express')
const app = express()
app.listen(3007, () => console.log('ok...'))

// 加载路由模块并注册路由
app.use('/api', require(path.join(__dirname, 'routers', 'login')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'category')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'article')))
app.use('/my', require(path.join(__dirname, 'routers', 'user')))
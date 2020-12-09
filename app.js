const path = require('path')
const express = require('express')
const app = express()
app.listen(3007, () => console.log('ok...'))
// 应用级配置
// 允许跨域请求
const cors = require('cors')
app.use(cors())
// 接受post查询字符串参数
app.use(express.urlencoded({
    extended: false
}))
// 开放静态资源
app.use(express.static(path.join(__dirname, 'uploads')))
// 配置登录认证
const expressJWT = require('express-jwt')
app.use(expressJWT({
    secret: 'bigevent-9760',
    algorithms: ['HS256']
}).unless({
    path: /^\/api/
}))
// 加载路由模块并注册路由
app.use('/api', require(path.join(__dirname, 'routers', 'login')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'category')))
app.use('/my/article', require(path.join(__dirname, 'routers', 'article')))
app.use('/my', require(path.join(__dirname, 'routers', 'user')))
// 错误配置， 统一处理tokne的问题
app.use((err, req, res, next) => {
    // 真的token问题，做判断
    // console.log(err)
    if (err.name === 'UnauthorizedError') {
        console.log(err.message);
        res.json({
            status: 1,
            message: '身份认证失败！'
        });
    }
});
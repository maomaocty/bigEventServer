const express = require('express');
const router = express.Router();
const db = require('../db')
const jwt = require('jsonwebtoken')
const utility = require('utility')

// 登录
router.post('/login', async (req, res) => {
    // console.log(req.body);
    let r = await db('select * from user where username = ? and password = ?', [req.body.username, utility.md5(req.body.password)])
    // console.log(r);
    if (r && r.length > 0) {
        res.json({
            status: 0,
            message: "登录成功",
            token: 'Bearer ' + jwt.sign({
                username: r[0].username,
                id: r[0].id
            }, 'bigevent-9760', {
                expiresIn: 200000
            })

        })
    } else {
        res.json({
            status: 1,
            message: '登录失败'
        })
    }
    // 模拟登录过程
    // if (req.body.username === 'admin' && req.body.password === '123') {
    //     res.json({
    //         status: 0,
    //         message: '登录成功'
    //     })
    // } else {
    //     res.json({
    //         status: 1,
    //         message: '登录失败'
    //     })
    // }
})
// 注册
router.post('/reguser', async (req, res) => {
    req.body.password = utility.md5(req.body.password)
    let r = await db('insert into user set ?', req.body)
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: "注册成功！"
        })
    } else {
        res.json({
            status: 1,
            message: "注册失败！"
        })
    }
})

// 导出路由模块
module.exports = router
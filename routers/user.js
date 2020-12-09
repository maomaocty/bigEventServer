const express = require('express')
const router = express.Router()
const db = require('../db')
const utility = require('utility')

// 配置路由

// 获取用户信息
/* 
1 拿到用户信息
2 查询数据库
*/
router.get('/userinfo', async (req, res) => {
    // res.send('淘气狗狗')
    // req.body
    // console.log(req.user.username);
    let r = await db('select * from user where username = ?', req.user.username)
    // console.log(r);
    if (r && r.lenght > 0) {
        res.json({
            status: 0,
            message: '用户信息获取成功',
            data: r[0]
        })
    } else {
        res.json({
            status: 1,
            message: '用户信息获取失败'
        })
    }
})
// 更新新用户信息
/* 
1 获取数据
2 整理数据
3 更新数据
*/
router.post('/userinfo', async (req, res) => {
    // console.log(req.body);
    let obj = {
        nickname: req.body.nickname,
        email: req.body.email
    }
    let r = await db('update user set ? where id = ?', [obj, req.body.id])
    // console.log(r);
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改用户信息成功'
        })
    } else {
        res.json({
            status: 1,
            message: '修改用户信息失败'
        })
    }
})
// 重置密码
/* 
1 获取参数
2 判读新密码 原密码 是否相等
3 验证原密码是否相等
4 更新密码
 */
router.post('/updatepwd', async (req, res) => {
    // 判断新旧密码是否一致
    if (req.body.oldPwd === req.body.newPwd) {
        res.json({
            status: 1,
            message: "原密码和新密码不能一样"
        })
        return
    }

    // 验证原密码是否有效
    let a = await db('select * from user where username = ? and password = ?', [req.user.username, utility.md5(req.body.oldPwd)])
    if (!a || a.length === 0) {
        res.json({
            status: 1,
            message: "原密码错误！"
        })
        return
    }
    let r = await db('update user set password = ? where username = ?', [utility.md5(req.body.newPwd), req.user.username])
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: "密码更新成功"
        })
    } else {
        res.json({
            status: 1,
            message: "密码更新失败"
        })
    }
})
// 更换头像
/* 
1 获取图片的字符串
2 更新数据库
 */
router.post('/update/avatar', async (req, res) => {
    // console.log(req.body.avatar);
    let r = await db('update user set user_pic = ? where username = ?', [req.body.avatar, req.user.username])
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: "头像更新成功"
        })
    } else {
        res.json({
            status: 1,
            message: "头像更新失败"
        })
    }
})
// 导出路由模块
module.exports = router
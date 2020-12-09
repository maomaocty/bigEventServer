const express = require('express')
const router = express.Router()
const db = require('../db')
const utility = require('utility')
// 配置路由
// 测试接口
// router.get('/tests', (req, res) => [
//     // res.send('淘气狗狗')

// ])
// 获取文章分类列表
router.get('/cates', async (req, res) => {
    // let obj = {
    //     name: req.body.name,
    //     alias:req.body.alias
    // }
    let r = await db('select * from category')
    // console.log(r);
    if (r) {
        res.json({
            status: 0,
            message: '获取文章列表成功',
            data: r
        })
    } else {
        res.json({
            status: 1,
            message: '获取文章列表失败'
        })
    }

})
// 新增文章分类
router.post('/addcates', async (req, res) => {
    let r = await db('insert into category set ?', req.body)
    // console.log(r);
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '新增文章分类成功'
        })
    } else {
        res.json({
            status: 1,
            message: '新增文章列表失败'
        })
    }
})
// 根据id删除文章分类
router.get('/deletecate/:id', async (req, res) => {
    // 获取id
    // let id = req.params.id

    let r = await db('delete from category where id=?', req.params.id)
    // console.log(r);
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '删除分类成功'
        })
    } else {
        res.json({
            status: 1,
            message: '删除分类失败'
        })
    }
})
// 根据id获取文章分类
router.get('/cates/:id', async (req, res) => {
    let r = await db('select * from category where id=?', req.params.id)
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '获取文章分类数据成功'
        })
    } else {
        res.json({
            status: 1,
            message: '获取文章分类失败'
        })
    }
})
// 根据id更新文章分类
router.post('/updatecate', async (req, res) => {
    let obj = {
        name: req.body.name,
        alias: req.body.alias
    }
    let r = await db('update category set ? where id=?', [obj, req.body.id])
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '修改成功'
        })
    } else {
        res.json({
            status: 1,
            message: '修改分类失败'
        })
    }
})
// 导出路由模块
module.exports = router
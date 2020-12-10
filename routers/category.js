const express = require('express')
const router = express.Router()
const db = require('../db')
const utility = require('utility')
const multer = require('multer')
const path = require('path')
const upload = multer({
    dest: path.join(__dirname, '../uploads')
})
const moment = require('moment')
// 配置路由
// 发布新文章
/* 
步骤：
 1、获取请求提交过来的fd数据
 2、处理数据
   formdata数据： 
    1、下载安装multer(第三方模块)
    2、引入multer(不是在入口文件引入使用，那个路由模块须有获取formdata数据，就在哪里引入)
    3、定义一个multer对象
      1、配置上传文件的文件夹{dest:'路径'}
      2、在路由的第二个参数配置upload.single('接口文档规定的图片名字')
 3、插入数据 sql
 4、返回数据
 */
router.post('/add', upload.single('cover_img'), async (req, res) => {
    // console.log(req.body);
    // console.log(req.file);
    // 组装数据
    let obj = req.body;
    obj.cover_img = req.file.filename;
    obj.pub_date = moment().format('YYYY-MM-DD hh:mm:ss');
    // 要求登录之后，必须在token中报错用户的id
    obj.author_id = req.user.id

    // 添加入库
    let r = await db('insert into article set ?', obj)
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: '添加成功'
        })
    } else {
        res.json({
            status: 1,
            message: '添加失败'
        })
    }
})
// 获取文章的列表数据
router.get('/list', async (req, res) => {
    // let pagenum = req.query.pagenum
    // let pagesize = req.pagesize
    // let cate_id = req.query.cate_id
    // let state = req.query.state

    // 使用结构的方式，获取请求参数
    let {
        pagenum,
        pagesize,
        cate_id,
        state
    } = req.query
    if (!pagesize || !pagenum) {
        return res.json({
            status: 1,
            message: "缺少必要参数"
        })
    }
    // 生成where条件，完成筛选工作
    let w = '';
    if (cate_id) {
        w += 'and cate_id' + cate_id
    }
    if (state) {
        w += `and state = ${state}`;
    }
    let sql = `select a.Id, a.title, a.pub_date, a.state, c.name cate_name from article a
    join category c on a.cate_id=c.Id
    join user u on u.id=a.author_id
    where u.id = 2 ${w}`;
    // console.log(sql);
    let r = await db(sql, req.user.id);
    let r2 = await db('select count(*) as total from article where author_id=?' + w, req.user.id);
    if (r && r2) {
        res.json({
            status: 0,
            message: '获取数据列表成功',
            data: r,
            total: r2[0].total
        })
    } else {
        res.json({
            status: 1,
            message: '查询失败'
        })
    }
    // console.log(r2);
})
// 根据id删除文章数据
router.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    let r = await db('delete from article where Id=?', id)
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: "删除文章成功"
        })
    } else {
        res.json({
            status: 1,
            message: "删除文章失败"
        })
    }
})
// 根据id获取文章详情
router.get('/:id', async (req, res) => {
    let r = await db('select * from article where Id =?',
        req.params.id)
    if (r && r.length > 0) {
        res.json({
            status: 0,
            message: "获取成功",
            data: r[0]
        })
    } else {
        res.json({
            status: 1,
            message: "获取失败"
        })
    }
})
// 根据id更新 文章信息
router.post('/edit', upload.single('cover_img'), async (req, res) => {
    // let obj = {
    //     title: req.body.title,
    //     content: req.body.content,
    //     cate_id: req.body.cate_id,
    //     state: req.body.state,
    //     cover_img: req.file.filename
    // }
    let obj = req.body
    if (req.file) {
        obj.cover_img = req.file.filename
    }
    let r = await db('update article set ? where Id=?', [obj, req.body.Id])
    console.log(r);
    if (r && r.affectedRows > 0) {
        res.json({
            status: 0,
            message: "更新成功"
        })
    } else {
        res.json({
            status: 1,
            message: '更新失败'
        })
    }
})
module.exports = router
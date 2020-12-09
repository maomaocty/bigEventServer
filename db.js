function db(sql, params = null) {
    const mysql = require('mysql')
    const conn = mysql.createConnection({
        // 连接地址
        host: 'localhost',
        // 端口号
        port: 3306,
        // 用户名
        user: 'root',
        // 密码
        password: 'root',
        // 书籍库
        database: 'big-event'
    })
    return new Promise((resolve, reject) => {
        conn.connect()
        conn.query(sql, params, (err, result) => {
            err ? reject(err) : resolve(result)
        })
        conn.end()
    }).catch(err => {
        console.log(err);
    })
}
module.exports = db
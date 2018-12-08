// mongodb用户名密码配置文件需要自己建，我是在服务器上自己建的
const mongoConfig = require("./mongoConfig")
exports.mongoose = {
    client : {
        url : `mongodb://${mongoConfig.user}:${mongoConfig.password}@120.77.219.106:27017/ant_blog`,// user: 数据库的用户名 password: 密码.
        options : {},
    },
}


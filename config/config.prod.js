// mongodb用户名密码配置文件需要自己建，我是在服务器上自己建的
const mongoConfig = require('./mongoConfig');
const redisConfig = require('./redisConfig');
exports.mongoose = {
  client: {
    url: `mongodb://${mongoConfig.user}:${mongoConfig.password}@120.77.219.106:27017/ant_blog`,// user: 数据库的用户名 password: 密码.
    options: {},
  },
};


// config redis
exports.redis = {
  client: {
    port: 6379, // Redis port
    host: '127.0.0.1', // Redis host
    password: redisConfig.password,
    db: 0,
  },
};

exports.baseUrl = 'http://120.77.219.106:7001';


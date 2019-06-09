const jwt = require('jsonwebtoken');
const { error_003, error_005 } = require('../common/common');

module.exports = (options, app) => {
  return async (ctx, next) => {
    //获取token
    let token = ctx.cookies.get('token');
    // 获取前端或以其他方式设置的cookie需要设置signed: false属性，避免对它做验签导致获取不到 cookie 的值。
    let username = ctx.cookies.get('username', { signed: false });
    let decoded = null;
    //验证token是否为空
    if (token) {
      try {
        decoded = jwt.verify(token, ctx.app.config.jwt.secret);
      } catch (err) {
        ctx.body = {
          code: error_003[ 0 ],
          message: error_003[ 1 ]
        };
        ctx.status = 200;
        return;
      }
      let _id = decoded.id; //检查是否有用户_id
      //验证客户端token是否合法
      if (_id) {
        let redis_token = await app.redis.get(username); // 获取redis中的token
        //验证是否为最新的token
        if (token === redis_token) {
          await next();
        } else {
          // 如果不是最新token，则代表用户在另一个机器上进行操作，需要用户重新登录保存最新token
          ctx.body = {
            code: error_003[ 0 ],
            message: error_003[ 1 ]
          };
          ctx.status = 200;
        }
      } else {
        ctx.body = {
          code: error_003[ 0 ],
          message: error_003[ 1 ]
        };
        ctx.status = 200;
      }
    } else {
      // 如果token为空，则代表客户没有登录
      ctx.body = {
        code: error_005[ 0 ],
        message: error_005[ 1 ]
      };
      ctx.status = 200;
    }
  };
};

const struct = require('superstruct').struct;
const Controller = require('egg').Controller;
const { error_001, error_002, error_003, error_004 } = require('../common/common');
const { user_001, user_002, user_003 } = require('../common/user');
const sha1 = require('sha1');
const rand = require('csprng');
const svgCaptcha = require('svg-captcha');


class User extends Controller {

  async getUserList() {
    const { ctx, service } = this;
    try {
      const user = await service.user.find();
      if (!user) {
        return ctx.helper.error(ctx, error_003[ 0 ], error_003[ 1 ]);
      } else {
        return ctx.helper.success(ctx, user);
      }
    } catch (e) {
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }
  }

  async getUserInfo() {
    const { ctx, service } = this;
    try {
      const user = await service.user.findById(ctx.id);
      if (!user) {
        return ctx.helper.error(ctx, error_003[ 0 ], error_003[ 1 ]);
      } else {
        return ctx.helper.success(ctx, user);
      }
    } catch (e) {
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }
  }

  async editUserInfo() {
    const { ctx, service } = this;
    const validator = struct({
      name: 'string',
      password: 'string?',
      id: 'string'
    });
    try {
      validator(ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ]);
    }
    try {
      const { name, password } = ctx.request.body;
      const newInfo = {};
      const salt = rand(160, 36);
      if (password) {
        newInfo.password = sha1(password + salt);
        newInfo.salt = salt;
      }
      newInfo.name = name;
      newInfo.updatedAt = Date.now();
      let user = await service.user.updateById(ctx.request.body.id, newInfo);
      return ctx.helper.success(ctx, user);
    }
    catch (e) {
      console.log(e);
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }
  }

  async login() {
    const { ctx, service } = this;
    const validator = struct({
      name: 'string',
      password: 'string'
    });

    try {
      validator(ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ]);
    }

    try {
      const user_f = await service.user.findByName({ name: ctx.request.body.name });
      ctx.request.body.password = sha1(ctx.request.body.password + user_f.salt);
      const user = await service.user.findOne(ctx.request.body);
      if (!user) {
        return ctx.helper.error(ctx, user_001[ 0 ], user_001[ 0 ]);
      } else if (user.role !== 1) {
        return ctx.helper.error(ctx, error_004[ 0 ], error_004[ 1 ]);
      } else {
        const token = service.user.createToken({ id: user.id });
        await service.user.updateById(user.id, { updatedAt: Date.now() });
        return ctx.helper.success(ctx, { token });
      }

    } catch (err) {
      console.log(err);
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }
  }

  async signup() {
    const { ctx, app, service } = this;
    const validator = struct({
      name: 'string',
      gender: 'string',
      email: 'string',
      password: 'string',
      authCode: 'string'
    });
    try {
      validator(ctx.request.body);
    } catch (err) {
      return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ]);
    }
    try {
      const user_f = await service.user.findByName({ name: ctx.request.body.username });
      if (user_f) { // 账号已存在
        return ctx.helper.error(ctx, user_002[ 0 ], user_002[ 1 ]);
      } else {
        // 判断验证码是否有效
        const ip = ctx.helper.getIp(ctx);
        const authCode = await app.redis.get(`${ip}_authCode`);
        console.log(authCode, ctx.request.body.authCode.toLowerCase());
        if (authCode !== ctx.request.body.authCode.toLowerCase()) {
          return ctx.helper.error(ctx, user_003[ 0 ], user_003[ 1 ]);
        }
        const salt = rand(160, 36);
        ctx.request.body.password = sha1(ctx.request.body.password + salt);
        ctx.request.body.salt = salt;
        const user = await service.user.create(ctx.request.body);
        console.log('user=======', user);
        let email = user.email;
        ctx.helper.sendUserEmail(ctx, email);
        return ctx.helper.success(ctx);

      }
    } catch (e) {
      console.log(e);
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }

  }

  generateAuthCode() {
    const { ctx, app } = this;
    const code = svgCaptcha.create({
      size: 6,  //验证码长度
      width: 100,
      height: 38,
      background: '#ddd',
      noise: 4,//干扰线条数
      fontSize: 32,
      ignoreChars: '0o1i',   //验证码字符中排除'0o1i'
      color: true // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    });

    const authCode = code.text.toLowerCase();
    const ip = ctx.helper.getIp(ctx);
    app.redis.set(`${ip}_authCode`, authCode, 'EX', 10 * 60); // 设置authCode 并指定过期时间十分钟
    return ctx.helper.success(ctx, { authCode: code.data, ip });
  }

}

module.exports = User;


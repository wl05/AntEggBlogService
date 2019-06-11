const struct = require('superstruct').struct;
const Controller = require('egg').Controller;
const { error_001, error_002, error_003, error_004 } = require('../common/common');
const { user_001, user_002, user_003, user_004, user_005, user_006, user_007 } = require('../common/user');
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
      validator(ctx.request.body);
      const user_name = await service.user.findOne({ name: ctx.request.body.name });
      const user_email = await service.user.findOne({ email: ctx.request.body.email });

      if (user_name) { // 账号已存在
        return ctx.helper.error(ctx, user_002[ 0 ], user_002[ 1 ]);
      } else if (user_email) {
        return ctx.helper.error(ctx, user_007[ 0 ], user_007[ 1 ]);
      } else {
        // 判断验证码是否有效
        const ip = ctx.helper.getIp(ctx);
        const authCode = await app.redis.get(`${ip}_authCode`);
        if (authCode !== ctx.request.body.authCode.toLowerCase()) {
          return ctx.helper.error(ctx, user_003[ 0 ], user_003[ 1 ]);
        }
        const salt = rand(160, 36);
        ctx.request.body.password = sha1(ctx.request.body.password + salt);
        ctx.request.body.salt = salt;
        const user = await service.user.create(ctx.request.body);
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

  // 邮箱激活
  async userActivation() {
    const { ctx, app, service } = this;
    const validator = struct({
      account: 'string',
      code: 'string'
    });
    console.log(ctx.request.query);
    try {
      validator(ctx.request.query);
    } catch (err) {
      return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ]);
    }
    try {
      const codeVal = await app.redis.get(`${ctx.request.query.code}`); // 从redis中获取code的值
      if (!codeVal) { // code失效，请重新发送邮件激活
        // return ctx.helper.error(ctx, user_006[ 0 ], user_006[ 1 ]);
        return ctx.body = user_006[ 1 ];
      }
      const email = ctx.request.query.account;
      if (codeVal !== email) { // 激活邮箱不一致
        // return ctx.helper.error(ctx, user_005[ 0 ], user_005[ 1 ]);
        return ctx.body = user_005[ 1 ];
      }
      const user = await service.user.findOne({ email });// 验证用户是否已注册
      if (user) {
        if (user.activated === '0') { // 如果没有激活
          await service.user.updateById(user._id, { activated: '1' });
          // ctx.redirect(app.config.redirectActivationUrl);
          // return ctx.helper.success(ctx, '邮箱激活成功');
          ctx.body = '邮箱激活成功';
        } else if (user.activated === '1') { // 此邮箱已经激活，不能重复激活
          // return ctx.helper.error(ctx, user_004[ 0 ], user_004[ 1 ]);
          ctx.body = user_004[ 1 ];
        }
      }
    } catch (error) {
      console.log(e);
      return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ]);
    }
  }
}

module.exports = User;


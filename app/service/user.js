const Service = require('egg').Service;
const jwt = require('jsonwebtoken');

class UserService extends Service {
  async create(info) {
    return await this.ctx.model.User.create(info);
  }

  async findByName(condition) {
    return await this.ctx.model.User.findOne(condition);
  }

  async findOne(condition) {
    return await this.ctx.model.User.findOne(condition, {
      password: 0,
      salt: 0
    });
  }

  async findById(_id) {
    return await this.ctx.model.User.findById({ _id }, {
      password: 0,
      salt: 0
    });
  }

  async find() {
    return await this.ctx.model.User.find({}, {
      password: 0,
      salt: 0
    });
  }

  async updateById(_id, data) {
    return await this.ctx.model.User.updateOne({ _id }, { $set: data });
  }

  createToken(data) {
    return jwt.sign(data, this.app.config.jwt.secret, { expiresIn: '12h' });
  }
}


module.exports = UserService;

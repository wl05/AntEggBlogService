const Service = require('egg').Service
const jwt = require('jsonwebtoken')

class UserService extends Service {
    
    async findOne (condition) {
        return await this.ctx.model.User.findOne(condition)
    }
    
    async findById (_id) {
        return await this.ctx.model.User.findById({_id})
    }
    
    async updateById (_id, data) {
        return await this.ctx.model.User.updateOne({_id}, {$set : data})
    }
    
    createToken (data) {
        return jwt.sign(data, this.app.config.jwt.secret, {expiresIn : "12h"})
    }
}

module.exports = UserService

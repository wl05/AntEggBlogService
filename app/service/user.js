const Service = require('egg').Service
const jwt = require('jsonwebtoken')

class UserService extends Service {
    
    async user (data) {
        return await this.ctx.model.User.create(data)
    }
    
    async findOne (condition) {
        return await this.ctx.model.User.findOne(condition)
    }
    
    async findById (_id) {
        return await this.ctx.model.User.findById({_id})
    }
    
    async updateById (_id, data) {
        return await this.ctx.model.User.updateOne({_id}, {$set : data})
    }
    
    async findOneAndUpdate (conditions, data, options = {}) {
        console.log(data)
        return await this.ctx.model.User.findOneAndUpdate(conditions, data, options)
    }
    
    createToken (data) {
        return jwt.sign(data, this.app.config.jwt.secret, {expiresIn : "12h"})
    }
    
    
}

module.exports = UserService

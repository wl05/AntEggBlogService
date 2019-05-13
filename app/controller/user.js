const struct = require('superstruct').struct
const Controller = require('egg').Controller
const {error_001, error_002, error_003, error_004} = require("../common/common")
const {user_001} = require("../common/user")
const sha1 = require('sha1')
const rand = require('csprng')

class User extends Controller {

    async getUserList() {
        const {ctx, service} = this
        try {
            const user = await service.user.find()
            if (!user) {
                return ctx.helper.error(ctx, error_003[0], error_003[1])
            } else {
                return ctx.helper.success(ctx, user)
            }
        } catch (e) {
            return ctx.helper.error(ctx, error_001[0], error_001[1])
        }
    }

    async getUserInfo() {
        const {ctx, service} = this
        try {
            const user = await service.user.findById(ctx.id)
            if (!user) {
                return ctx.helper.error(ctx, error_003[0], error_003[1])
            } else {
                return ctx.helper.success(ctx, user)
            }
        } catch (e) {
            return ctx.helper.error(ctx, error_001[0], error_001[1])
        }
    }

    async editUserInfo() {
        const {ctx, service} = this
        const validator = struct({
            name: 'string',
            password: 'string?',
            id: 'string'
        })
        try {
            validator(ctx.request.body)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[0], error_002[1])
        }
        try {
            const {name, password} = ctx.request.body
            const newInfo = {}
            const salt = rand(160, 36)
            if (password) {
                newInfo.password = sha1(password + salt)
                newInfo.salt = salt
            }
            newInfo.name = name
            newInfo.updatedAt = Date.now()
            let user = await service.user.updateById(ctx.request.body.id, newInfo)
            return ctx.helper.success(ctx, user)
        }
        catch (e) {
            console.log(e)
            return ctx.helper.error(ctx, error_001[0], error_001[1])
        }
    }

    async login() {
        const {ctx, service} = this
        const validator = struct({
            name: 'string',
            password: 'string'
        })

        try {
            validator(ctx.request.body)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[0], error_002[1])
        }

        try {
            const user_f = await service.user.findByName({name: ctx.request.body.name})
            ctx.request.body.password = sha1(ctx.request.body.password + user_f.salt)
            const user = await service.user.findOne(ctx.request.body)
            if (!user) {
                return ctx.helper.error(ctx, user_001[0], user_001[0])
            } else if (user.role !== 1) {
                return ctx.helper.error(ctx, error_004[0], error_004[1])
            } else {
                const token = service.user.createToken({id: user.id})
                await service.user.updateById(user.id, {updatedAt: Date.now()})
                return ctx.helper.success(ctx, {token})
            }

        } catch (err) {
            console.log(err)
            return ctx.helper.error(ctx, error_001[0], error_001[1])
        }
    }

}

module.exports = User


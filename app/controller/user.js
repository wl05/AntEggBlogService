const struct = require('superstruct').struct
const Controller = require('egg').Controller
const {error_001, error_002, error_003, error_004} = require("../common/common")
const {user_001} = require("../common/user")

class User extends Controller {
    
    async getUserInfo () {
        const {ctx, service} = this
        let user = await service.user.findById(ctx.id)
        if (!user) {
            return ctx.helper.error(ctx, error_003[ 0 ], error_003[ 1 ])
        } else {
            return ctx.helper.success(ctx, user)
        }
        
    }
    
    async login () {
        const {ctx, service} = this
        let validator = struct({
            name : 'string',
            password : 'string'
        })
        
        try {
            validator(ctx.request.body)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        
        try {
            const user = await service.user.findOne(ctx.request.body)
            if (!user) {
                return ctx.helper.error(ctx, user_001[ 0 ], user_001[ 0 ])
            } else if (user.role !== 1) {
                return ctx.helper.error(ctx, error_004[ 0 ], error_004[ 1 ])
            } else {
                let token = service.user.createToken({id : user.id})
                await service.user.updateById(user.id, {updatedAt : Date.now()})
                return ctx.helper.success(ctx, {token})
            }
            
        } catch (err) {
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
}

module.exports = User


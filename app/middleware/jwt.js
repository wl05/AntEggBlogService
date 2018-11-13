const {error_003} = require("../common/common")

module.exports = () => {
    const jwt = require('jsonwebtoken')
    return async (ctx, next) => {
        let bearerToken = ctx.headers.authorization,
            decoded = null,
            token = bearerToken && bearerToken.replace("Bearer ", "")
        try {
            decoded = jwt.verify(token, ctx.app.config.jwt.secret)
        } catch (err) {
            ctx.body = {
                code : error_003[ 0 ],
                message : error_003[ 1 ]
            }
            ctx.status = 200
            return
        }
        ctx.id = decoded.id
        await next()
    }
}
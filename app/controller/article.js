const struct = require('superstruct').struct
const Controller = require('egg').Controller
const {error_001, error_002} = require("../common/common")


class Article extends Controller {
    // create tag
    async create () {
        const {ctx, service} = this
        let validator = struct({
            title : 'string',
            tag : 'string',
            markdownValue : 'string?',
            htmlValue : 'string?',
            publishAt : 'number',
            category : 'string',
            publishStatus : struct.enum([ '1', '2' ])
        })
        try {
            validator(ctx.request.body)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        
        try {
            let content = {...ctx.request.body}
            content.creator = ctx.id
            const article = await service.article.create(content)
            return ctx.helper.success(ctx, article)
        } catch (err) {
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
    async getArticle () {
        const {ctx, service} = this
        let validator = struct({
            _id : 'string'
        })
        
        try {
            validator(this.ctx.params)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        
        try {
            const article = await service.article.findOne(this.ctx.params)
            return ctx.helper.success(ctx, article)
        } catch (err) {
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
    async getArticles () {
        const {ctx, service} = this
        let validator = struct({
            pageSize : 'string?',
            pageLimit : 'string?',
            publishStatus : 'string?'
        })
        
        try {
            validator(ctx.request.query)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        
        try {
            const article = await service.article.find(ctx.request.query)
            return ctx.helper.success(ctx, article)
        } catch (err) {
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
    async findByIdAndUpdate () {
        const {ctx, service} = this
        const validatorParams = struct({
            _id : 'string'
        })
        const validatorBody = struct({
            title : 'string?',
            tag : 'string?',
            markdownValue : 'string?',
            htmlValue : 'string?',
            publishAt : 'number?',
            publishStatus : struct.enum([ '1', '2' ]),
            category : 'string',
        })
        try {
            validatorParams(ctx.params)
            validatorBody(ctx.request.body)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        try {
            const updatingContent = {
                ...ctx.request.body,
                updatedAt : Date.now(),
                status : '1'
            }
            const categories = await service.article.findByIdAndUpdate(ctx.params._id, updatingContent)
            return ctx.helper.success(ctx, categories)
        } catch (err) {
            console.log(err)
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
    async deleteArticle () {
        const {ctx, service} = this
        const validator = struct({
            id : 'string'
        })
        try {
            validator(ctx.params)
        } catch (err) {
            return ctx.helper.error(ctx, error_002[ 0 ], error_002[ 1 ])
        }
        
        try {
            const updatingContent = {
                deletedAt : Date.now(),
                status : '2'
            }
            const categories = await service.article.findByIdAndUpdate(ctx.params.id, updatingContent)
            
            return ctx.helper.success(ctx, categories)
        } catch (err) {
            return ctx.helper.error(ctx, error_001[ 0 ], error_001[ 1 ])
        }
    }
    
}

module.exports = Article


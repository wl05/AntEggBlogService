const Service = require('egg').Service

class ArticleService extends Service {
    async create (content) {
        return await this.ctx.model.Article.create(content)
    }
    
    async count () {
        return await this.ctx.model.Article.countDocuments({status : {$ne : '2'}})
    }
    
    async findByIdAndUpdate (_id, content) {
        return await this.ctx.model.Article.findByIdAndUpdate({_id, status : {$ne : '2'}}, {$set : content})
    }
    
    async find (params) {
        let {
            pageSize,
            pageLimit,
            publishStatus
        } = {...params}
        let condition = {}
        if (publishStatus) {
            condition.publishStatus = publishStatus
        }
        pageSize = pageSize ? Number(pageSize) : 0
        pageLimit = pageLimit ? Number(pageLimit) : 0
        const count = await this.count()
        const article = await this.ctx.model.Article.find({...condition, status : {$ne : '2'}})
            .populate('tag', "name")
            .populate('creator', "name")
            .populate('category', "name")
            .skip((pageSize - 1) * pageLimit)
            .limit(pageLimit)
            .sort({'publishAt' : -1})
        return {count, article, pageSize, pageLimit}
    }
    
    async findOne (condition) {
        return await this.ctx.model.Article.findOne({
            ...condition,
            status : {$ne : '2'}
        }).populate('category', "name").populate('tag', "name")
            .populate('creator', "name")
    }
    
    async updateManyByTagId (id) {
        return await this.ctx.model.Article.updateMany({tag : id}, {$set : {status : 2}})
    }
    
    async updateManyByCategoryId (id) {
        return await this.ctx.model.Article.updateMany({category : id}, {$set : {status : 2}})
    }
    
    async findByTag (tag) {
        return await this.ctx.model.Article.find({tag, status : {$ne : '2'}}, {
            publishAt : 1,
            title : 1
        }).sort({'publishAt' : -1})
    }
    
    async findByCategory (category) {
        return await this.ctx.model.Article.find({category, status : {$ne : '2'}}, {
            publishAt : 1,
            title : 1
        }).sort({'publishAt' : -1})
    }
    
    async updateViewCount (_id) {
        return await this.ctx.model.Article.updateOne({_id}, {
            $inc : {
                viewCount : 1
            }
        })
    }
    
    
}


module.exports = ArticleService

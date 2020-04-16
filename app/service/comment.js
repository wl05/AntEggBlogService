'use strict';
const Service = require('egg').Service;
class CommentService extends Service {
  async create({ article_id, commentator, content, reply_to_comment_id, reply_to_user_id }) {
    return await this.ctx.model.Comment.create({ article_id, commentator, content, reply_to_comment_id, reply_to_user_id });
  }

  async find(condition) {
    return await this.ctx.model.Comment.find({ ...condition, status: { $ne: '2' } }).populate('commentator', 'name').lean()
      .exec();
  }

  // async findByArticleId(article_id) {
  //   return await this.ctx.model.Comment.find({ article_id });
  // }

  // async findByIdAndUpdate({ article_id, user_id, content, reply_to_comment_id, reply_to_user_id }) {
  //   const query = { article_id, status: { $ne: '2' } };
  //   const update = { article_id, user_id, content, reply_to_comment_id, reply_to_user_id };
  //   const options = { upsert: true };
  //   return await this.ctx.model.Comment.save(query, { $set: update }, { options });
  // }
}

module.exports = CommentService;

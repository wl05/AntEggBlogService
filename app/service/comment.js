'use strict';
const Service = require('egg').Service;
class CommentService extends Service {
  async find(condition) {
    return await this.ctx.model.Comment.find({ ...condition, status: { $ne: '2' } });
  }

  async findById(id) {
    return await this.ctx.model.Comment.findById(id);
  }

  async findByIdAndUpdate({ _id, article_id, user_id, content, comment_id, reply_to_user_id }) {
    const query = { _id, status: { $ne: '2' } };
    const update = { article_id, user_id, content, comment_id, reply_to_user_id };
    const options = { upsert: true };


    return await this.ctx.model.Comment.findByIdAndUpdate(query, { $set: update }, { options });
  }
}

module.exports = CommentService;

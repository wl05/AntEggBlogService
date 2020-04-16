'use strict';
const struct = require('superstruct').struct;
const Controller = require('egg').Controller;
const { error_001, error_002 } = require('../common/common');

class Comment extends Controller {
  // post comment
  async create() {
    const { ctx, service } = this;
    const validator = struct({
      article_id: 'string',
      commentator: 'string',
      content: 'string',
      reply_to_comment_id: 'string?',
      reply_to_user_id: 'string?',
    });
    const params = { ...ctx.request.body, commentator: ctx.id };
    try {
      validator(params);
    } catch (err) {
      console.log(err);
      return ctx.helper.error(ctx, error_002[0], error_002[1]);
    }

    try {
      await service.comment.create(params);
      return ctx.helper.success(ctx);
    } catch (err) {
      console.log('err', err);
      return ctx.helper.error(ctx, error_001[0], error_001[1]);
    }
  }

  async getCommentByArticleId() {
    const { ctx, service } = this;
    const validator = struct({
      article_id: 'string',
    });

    try {
      validator(ctx.params);
    } catch (err) {
      return ctx.helper.error(ctx, error_002[0], error_002[1]);
    }

    try {
      const res = await service.comment.find(ctx.request.params);
      for (const val of res) {
        val.sub_comments = [];
      }
      return ctx.helper.success(ctx, res);
    } catch (err) {
      return ctx.helper.error(ctx, error_001[0], error_001[1]);
    }
  }


  // async get() {
  //   const { ctx, service } = this;
  //   const validator = struct({
  //     id: 'string?',
  //   });

  //   try {
  //     validator(ctx.params);
  //   } catch (err) {
  //     return ctx.helper.error(ctx, error_002[0], error_002[1]);
  //   }

  //   try {
  //     const tag = await service.tags.find(ctx.request.params);
  //     return ctx.helper.success(ctx, tag);
  //   } catch (err) {
  //     return ctx.helper.error(ctx, error_001[0], error_001[1]);
  //   }
  // }

  // async deleteTag() {
  //   const { ctx, service } = this;
  //   const validator = struct({
  //     id: 'string',
  //   });
  //   try {
  //     validator(ctx.params);
  //   } catch (err) {
  //     return ctx.helper.error(ctx, error_002[0], error_002[1]);
  //   }
  //   try {
  //     const updatingContent = {
  //       deletedAt: Date.now(),
  //       status: '2',
  //     };
  //     await service.tags.findByIdAndUpdate(ctx.params.id, updatingContent);
  //     await service.article.updateManyByTagId(ctx.params.id);
  //     return ctx.helper.success(ctx);
  //   } catch (err) {
  //     console.log(err);
  //     return ctx.helper.error(ctx, error_001[0], error_001[1]);
  //   }
  // }

}

module.exports = Comment;


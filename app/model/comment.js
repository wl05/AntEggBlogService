'use strict';
module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const comments = new Schema({
    user_id: { // 评论人id
      type: Schema.ObjectId,
      ref: 'Users',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replyTo: { // 回复
      comment_id: { // 区分回复的是哪一条
        type: Schema.ObjectId,
        required: true,
      },
      reply_to_user_id: { // 标示回复的哪一个人
        type: Schema.ObjectId,
        ref: 'Users',
      },
    },
  });


  const CommentSchema = new Schema({
    article_id: {
      type: String,
      required: true,
    },
    comments: [comments],
    createAt: {
      type: Number,
      default: Date.now,
    },
    updatedAt: {
      type: Number,
    },
    deletedAt: {
      type: Number,
    },
    status: { // 状态
      type: String,
      enum: ['0', '1', '2'], // 0存在 1更新，2 删除
      default: '0',
    },
  }, { versionKey: false });

  return mongoose.model('Comments', CommentSchema);
};

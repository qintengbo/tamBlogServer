const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 评论集合字段
const CommentSchema = new Schema({
  articleId: { // 关联文章id
    type: Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  createDate: { // 创建时间
    type: Date,
    default: Date.now
  },
  commenter: { // 评论者
    type: Schema.Types.ObjectId,
    ref: 'Visitor',
    required: true
  },
  content: { // 评论内容
    type: String,
    required: true,
    maxlength: 100
  },
  show: { // 是否展示
    type: Boolean,
    default: true
  },
  beCommenter: { // 被评论者
    type: Schema.Types.ObjectId,
    ref: 'Visitor'
  },
  reply: [{ // 子评论
    type: Schema.Types.ObjectId,
    ref: 'Comment'
  }]
});

module.exports = mongoose.model('Comment', CommentSchema);

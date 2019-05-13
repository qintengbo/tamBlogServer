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
  commenterName: { // 评论者名称
    type: String,
    required: true
  },
  commenterAvatar: { // 评论者头像
    type: String,
    default: ''
  },
  content: { // 评论内容
    type: String,
    required: true
  },
  email: { // 评论者邮箱
    type: String,
    required: true
  },
  show: {
    type: Boolean,
    default: true
  },
  reply: [] // 子评论集合
});

module.exports = mongoose.model('Comment', CommentSchema);

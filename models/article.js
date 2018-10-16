const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 文章集合字段
const ArticleSchema = new Schema({
  title: { // 标题
    type: String,
    required: true
  },
  classification: { // 分类
    type: Schema.Types.ObjectId,
    ref: 'classifications',
    required: true
  },
  tag: { // 标签
    type: Schema.Types.ObjectId,
    ref: 'tags',
    required: true
  },
  content: { // 内容
    type: String,
    required: true
  },
  status: { // 状态： 2-未发布，1-已发布
    type: Number,
    required: true
  },
  laudNum: { // 点赞数，默认为0
    type: Number,
    default: 0
  },
  date: { // 时间
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Article', ArticleSchema);
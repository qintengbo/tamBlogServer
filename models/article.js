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
    ref: 'Classification',
    required: true
  },
  tag: [{ // 标签
    type: Schema.Types.ObjectId,
    ref: 'Tag',
    required: true
  }],
  content: { // 内容
    type: String,
    required: true
  },
  status: { // 状态： 1-已发布，2-未发布
    type: Number,
    required: true
  },
  laudNum: { // 点赞数
    type: Number,
    default: 0
  },
  createDate: { // 创建时间
    type: Date,
    default: Date.now
  },
  updateDate: { // 更新时间
    type: Date,
    default: Date.now
  },
  coverImg: { // 封面图
    type: String,
    required: true
  },
  lead: { // 导语
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Article', ArticleSchema);

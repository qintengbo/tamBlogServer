const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 分类集合字段
const ClassificationSchema = new Schema({
  name: { // 名称
    type: String,
    required: true
  },
  abbreviationName: { // 缩写名
    type: String,
    required: true
  },
  date: { // 时间
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Classification', ClassificationSchema);
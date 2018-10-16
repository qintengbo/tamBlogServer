const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 标签集合字段
const TagSchema = new Schema({
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

module.exports = mongoose.model('Tag', TagSchema);

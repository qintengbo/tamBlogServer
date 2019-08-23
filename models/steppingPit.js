const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 踩坑记录集合字段
const SteppingPitSchema = new Schema({
  title: { // 标题
    type: String,
    required: true
  },
  description: { // 问题描述
    type: String,
    required: true
  },
  solution: { // 解决方案
    type: String,
    required: true
  },
  status: { // 状态： 1-已发布，2-未发布
    type: Number,
    required: true
  },
  version: { // 出现问题的版本
    type: String,
    required: true
  },
  readNum: { // 阅读数
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
});

module.exports = mongoose.model('SteppingPit', SteppingPitSchema);
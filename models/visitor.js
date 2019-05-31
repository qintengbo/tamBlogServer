const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 访客集合字段
const VisitorSchema = new Schema({
  name: { // 名称
    type: String,
    required: true,
    maxlength: 10
  },
  avatar: { // 头像
    type: String,
    default: ''
  },
  email: { // 邮箱
    type: String,
    required: true
  },
  visIp: { // ip地址
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Visitor', VisitorSchema);

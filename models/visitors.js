const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 访客集合字段
const VisitorsSchema = new Schema({
  ip: { // 访客ip
    type: String,
    required: true
  },
  os: String, // 系统型号
  browser: String, // 浏览器类型
}, { timestamps: true });

module.exports = mongoose.model('Visitors', VisitorsSchema);

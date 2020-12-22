const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 评论人集合字段
const CommenterSchema = new Schema({
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
		default: ''
	},
	isAuthor: { // 是否作者
		type: Boolean,
		default: false
	}
});

module.exports = mongoose.model('Commenter', CommenterSchema);

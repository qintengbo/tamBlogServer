const express = require('express');
const router = express.Router();
const User = require('../../../models/user');
const Commenter = require('../../../models/commenter');
const config = require('./../../../config/config');

// 注册账号
router.post('/signup', (req, res) => {
	const { body: { username, password } } = req;
  if (!username) {
    return res.send({
      code: -1,
      msg: '请输入您的用户名'
    });
	}
	if (!password) {
		return res.send({
			code: -1,
			msg: '请输入您的密码'
		});
	}
	// 先保存个人信息
	const { userInfo: { name, email } } = config;
	const newCommenter = new Commenter({
		name,
    email,
    visIp: '0.0.0.0',
		isAuthor: true
	});
	newCommenter.save((err, doc) => {
		if (err) {
			const { message } = err;
			return res.send({
				code: -2,
				msg: '注册失败',
				error: message
			});
		}
		let newUser = new User({
			username,
			password,
			userInfo: doc._id
		});
		// 保存用户账号密码
		newUser.save(error => {
			if (error) {
				const { message } = error;
				return res.send({
					code: -2,
					msg: '注册失败',
					error: message
				});
			}
			res.send({
				code: 0,
				msg: '注册成功'
			});
		});
	});	
});

module.exports = router;

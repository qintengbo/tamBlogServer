const express = require('express');
const router = express.Router();
const Visitor = require('./../../../models/visitor');

// 获取用户信息
router.get('/userInfo', (req, res) => {
	if (!req.user) {
		return res.send({
			code: -1,
			msg: '获取用户信息失败'
		});
	}
	const { user: { username, userInfo } } = req;
	Visitor.findById(userInfo, (err, doc) => {
		if (err) {
			const { message } = err;
			return res.send({
				code: -1,
				msg: '获取用户信息失败',
				error: message
			});
		}
		res.send({
			code: 0,
			data: {
				username,
				userInfo: doc
			},
			msg: '获取用户信息成功'
		});
	});
});

module.exports = router;
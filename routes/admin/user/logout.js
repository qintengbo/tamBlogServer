/*
 * @Author       : qintengbo
 * @Date         : 2020-05-28 09:35:26
 * @LastEditors  : qintengbo
 * @LastEditTime : 2020-05-28 10:26:11
 * @Description  : 退出登录接口
 */ 
const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

router.post('/logout', (req, res) => {
	const { body: { username } } = req;
	User.updateOne({ username }, { token: '' }, (err, raw) => {
		if (err || !raw.ok === 1) {
			return res.send({
				code: -1,
				msg: '退出登录失败'
			});
		}
		res.send({
			code: 0,
			msg: '退出登录成功'
		});
	});
});

module.exports = router;

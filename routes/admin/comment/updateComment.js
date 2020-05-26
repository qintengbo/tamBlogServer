/*
 * @Author       : qintengbo
 * @Date         : 2020-05-22 14:35:25
 * @LastEditors  : qintengbo
 * @LastEditTime : 2020-05-22 15:56:55
 * @Description  : 修改评论接口
 */ 
const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');

router.put('/updateComment', (req, res) => {
	const { body: { id, show } } = req;
	const text = show ? '隐藏' : '显示';
	Comment.updateMany({ _id: { $in: id } }, { show: id.length > 1 && show ? false : !show }, (err, doc) => {
		if (err) {
			const { message } = err;
			return res.send({
				code: -1,
				msg: message
			});
		}
		if (doc.ok === 1) {
			res.send({
				code: 0,
				msg: `${text}评论成功`
			});
		} else {
			res.send({
				code: -1,
				msg: `${text}评论失败`
			});
		}
	});
});

module.exports = router;

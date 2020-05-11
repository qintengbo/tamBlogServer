/*
 * @Author       : qintengbo
 * @Date         : 2020-05-08 17:27:47
 * @LastEditors  : qintengbo
 * @LastEditTime : 2020-05-11 20:07:24
 * @Description  : 子评论列表接口，用于加载更多子评论
 */
const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');

router.get('/childCommentList', (req, res) => {
	const { query: { id, childPage, size, isAll, skipNum } } = req;
	Comment.findOne({ _id: id }, (err, doc) => {
		if (err) {
			const { message } = err;
			return res.send({
				code: -1,
				msg: '加载更多子评论失败',
				error: message
			});
		}
		let opts = { 
			path: 'reply', 
			populate: [
				{ path: 'commenter', select: 'name avatar' }, 
				{ path: 'beCommenter', select: 'name' }
			], 
			options: { 
				skip: Number(skipNum),
			} 
		};
		if (isAll === 'undefined') {
			opts = {
				...opts,
				options: {
					skip: (childPage - 1) * Number(size),
					limit: Number(size)
				}
			};
		}
		Comment.populate(doc, opts, (error, collection) => {
			if (error) {
				const { message } = error;
				return res.send({
					code: -1,
					msg: '加载更多子评论失败',
					error: message
				});
			}
			const { reply } = collection;
			res.send({
				code: 0,
				data: reply,
				msg: '加载更多子评论成功'
			});
		});
	});
});

module.exports = router;

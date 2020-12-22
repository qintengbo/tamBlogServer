/*
 * @Author       : qintengbo
 * @Date         : 2020-05-13 15:21:07
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2020-12-22 16:30:30
 * @Description  : 后台评论列表接口
 */
const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');
const Article = require('../../../models/article');
const Commenter = require('../../../models/commenter');

router.get('/commentList', async (req, res) => {
	const { query: { page, size, status, date, commenterKey, titleKey } } = req;
	let params = {};
	// 是否有展示状态查询
	if (status && status !== '0') {
		params = {
			...params,
			show: status === '1' ? true : false
		};
	}
	// 是否有日期查询
	if (date) {
		const [startDate, endDate] = date;
		params = {
			...params,
			createDate: { $gte: startDate, $lte: endDate }
		};
	}
	// 模糊查询文章标题
	if (titleKey) {
		const articleArr = new Promise((resolve, reject) => {
			Article.find({ title: { $regex: titleKey, $options: 'i' } }, '_id', (err, docs) => {
				if (err) reject(err);
				const arr = [];
				docs.forEach(item => {
					arr.push(item._id);
				});
				resolve(arr);
			});
		});
		await articleArr.then(res => {
			params = {
				...params,
				relationId: { $in: res }
			};
		}, err => {
			throw err;
		});
	}
	// 模糊查询评论者
	if (commenterKey) {
		const commenterOpt = {
			$or: [
				{ name: { $regex: commenterKey, $options: 'i' } },
				{ email: { $regex: commenterKey, $options: 'i' } },
				{ visIp: { $regex: commenterKey, $options: 'i' } }
			]
		};
		const commenterArr = new Promise((resolve, reject) => {
			Commenter.find(commenterOpt, '_id', (err, docs) => {
				if (err) reject(err);
				const arr = [];
				docs.forEach(item => {
					arr.push(item._id);
				});
				resolve(arr);
			});
		});
		await commenterArr.then(res => {
			params = {
				...params,
				commenter: { $in: res }
			};
		}, err => {
			throw err;
		});
	}
	// 查询评论总数
	const total = await Comment.find(params).countDocuments((err, count) => {
		if (err) reject(err);
		return count;
	});
	Comment.find(params, null, {
		sort: { createDate: -1 },
		skip: (Number(page) - 1) * Number(size), 
		limit: Number(size)
	}, (err, docs) => {
		if (err) {
			const { message } = err;
			return res.send({
				code: -1,
				msg: '查询评论列表失败',
				error: message
			});
		}
		const opts = [
			{ path: 'commenter', select: 'name email visIp' },
			{ path: 'beCommenter', select: 'name' },
			{ path: 'relationId', select: 'title' } 
		];
		Comment.populate(docs, opts, (error, collection) => {
			if (error) {
				const { message } = error;
				return res.send({
					code: -1,
					msg: '查询评论列表失败',
					error: message
				});
			}
			res.send({
				code: 0,
				msg: '查询评论列表成功',
				data: {
					list: collection,
					total
				}
			});
		});
	});
});

module.exports = router;

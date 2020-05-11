const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const Comment = require('../../../models/comment');
const Visitor = require('../../../models/visitor');
const Article = require('../../../models/article');
const sendMail = require('../../../services/sendMail');

// 新增评论接口
router.post('/addComment', (req, res) => {
	if (req.session.captcha) {
		// 判断验证码是否正确
		if (req.body.imgCode !== req.session.captcha) {
			return res.send({
				code: -2,
				msg: '验证码错误'
			});
		}
		
		// 保存评论前先保存评论者的信息
		Visitor.findOne({ email: req.body.email }, null, null, (error, collection) => {
			if (error) {
				const { message } = error;
				return res.send({
					code: -1,
					msg: '回复失败',
					error: message
				});
			}
			const { name, avatar, email } = req.body;
			if (collection) {
				collection.name = name;
				collection.avatar = avatar;
				collection.visIp = req.ip;
				collection.save((err, doc) => {
					if (err) throw err;
					addCommentFn(doc._id, req.body);
				});
			} else {
				const newVisitor = new Visitor({
					name,
					avatar,
					email,
					visIp: req.ip
				});
				newVisitor.save((err, doc) => {
					if (err) throw err;
					addCommentFn(doc._id, req.body);
				});
			}
		});
		
		addCommentFn = (id, param) => {
			const { content, relationId, beCommenter, isMain, commentId, name, aimsId } = param;
			let commentData = {};
			if (isMain) {
				commentData = {
					relationId,
					content,
					commenter: id,
				};
			} else {
				commentData = {
					relationId,
					content,
					commenter: id,
					beCommenter,
					isMain
				};
			}
			Comment.create(commentData, (err, doc) => {
				if (err) {
					const { message } = err;
					return res.send({
						code: -1,
						msg: '回复失败',
						error: message
					});
				}
				if (!isMain) {
					// 如果是子评论则往主评论中添加 
					Comment.findOneAndUpdate({ _id: commentId }, { $addToSet: { reply: doc._id } }, { new: true }, (error, docs) => {
						if (error) {
							const { message } = error;
							return res.send({
								code: -1,
								msg: '回复失败',
								error: message
							});
						}
						const opts = [
							{ path: 'commenter', select: 'name avatar' },
							{ path: 'beCommenter', select: 'name' }
						];
						Comment.populate(doc, opts, (er, popDoc) => {
							if (er) throw er;
							res.send({
								code: 0,
								data: popDoc,
								msg: '回复成功'
							});
						});
					});
					// 查询被回复者详情
					const beCommenterInfo = new Promise((resolve, reject) => {
						Visitor.findOne({ _id: beCommenter }, null, null, (error, result) => {
							if (error) reject(error);
							resolve(result);
						});
					});
					// 查询文章详情
					const articleInfo = new Promise((resolve, reject) => {
						Article.findOne({ _id: relationId }, null, null, (error, result) => {
							if (error) reject(error);
							resolve(result);
						});
					});
					// 查询被评论详情
					const commentInfo = new Promise((resolve, reject) => {
						Comment.findOne({ _id: aimsId }, null, null, (error, result) => {
							if (error) reject(error);
							resolve(result);
						});
					});
					// 查询最新三篇文章
					const articleList = new Promise((resolve, reject) => {
						Article.find({ status: 1 }, null, { sort: { updateDate: -1 }, limit: 3 }, (error, result) => {
							if (error) reject(error);
							resolve(result);
						});
					})
					Promise.all([beCommenterInfo, articleInfo, commentInfo, articleList]).then(result => {
						// 向被回复者发送邮件
						const template = ejs.compile(fs.readFileSync(path.join(__dirname, '../../../views/email.ejs'), 'utf8'));
						const mdDoc = md.render(result[2].content);
						const mdReplyDoc = md.render(content);
						const html = template({
							name: result[0].name,
							replyName: name,
							articleTitle: result[1].title,
							original: mdDoc,
							replyContent: mdReplyDoc,
							articleId: relationId,
							articleList: result[3]
						});
						sendMail(result[0].email, '叮咚！你有一条新的回复消息', html);
					});
				} else {
					Comment.populate(doc, { path: 'commenter', select: 'name avatar' }, (er, popDoc) => {
						if (er) throw er;
						// 主评论则初始化子评论页数与子评论总数
						const newDoc = {
							replyTotal: 0,
							childPage: 1,
							...popDoc._doc
						};
						res.send({
							code: 0,
							data: newDoc,
							msg: '回复成功'
						});
					});
				}
			});
		}
	} else {
		return res.send({
			code: -2,
			msg: '验证码已过期，请重新输入'
		});
	}
});

module.exports = router;

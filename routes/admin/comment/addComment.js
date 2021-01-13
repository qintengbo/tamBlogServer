const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const md = require('markdown-it')();
const Comment = require('../../../models/comment');
const Commenter = require('../../../models/commenter');
const Article = require('../../../models/article');
const sendMail = require('../../../services/sendMail');
const config = require('./../../../config/config');

/**
 * @description: 新增评论接口
 * @param {string} id 被评论的id
 * @param {boolean} type 新增评论的类型 true-新增主评论 false-新增子评论
 * @param {boolean} isMain 被评论的类型 true-主评论 false-子评论
 * @param {string} content 评论内容
 * @param {string} relationId 关联文章id
 * @param {string} commenterId 评论人id
 * @param {string} beCommenter 被评论人id
 * @return: void
 */
router.post('/addComment', (req, res) => {
	const { body: { id, content, relationId, beCommenterId, commenterId, isMain, type } } = req;
	let params = {};
	if (type) {
		params = {
			relationId,
			content,
			commenter: commenterId
		};
	} else {
		params = {
			relationId,
			content,
      commenter: commenterId,
      beCommenter: beCommenterId,
      isMain: type
		};
  }
  Comment.create(params, (err, doc) => {
    if (err) {
      const { message } = err;
      return res.send({
        code: -1,
        msg: '回复失败',
        error: message
      });
    }
    if (!type) {
      let mainId = '';
      if (!isMain) {
        // 查找被评论的所属主评论
        mainId = new Promise((resolve, reject) => {
          Comment.find({ reply: { $elemMatch: { $eq: id } } }, async (error, docs) => {
            if (error) reject(error);
            resolve(docs[0]._id);
          });
        })
      } else {
        mainId = new Promise((resolve) => {
          resolve(id);
        });
      }
      // 往主评论中添加该评论id 
      Promise.all([mainId]).then(response => {
        Comment.findOneAndUpdate({ _id: response[0] }, { $addToSet: { reply: doc._id } }, { new: true }, (error) => {
          if (error) {
            const { message } = error;
            return res.send({
              code: -1,
              msg: '回复失败',
              error: message
            });
          }
          res.send({
            code: 0,
            msg: '回复成功'
          });
        });
      });
      // 查询被回复者详情
      const beCommenterInfo = new Promise((resolve, reject) => {
        Commenter.findOne({ _id: beCommenterId }, null, null, (error, result) => {
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
        Comment.findOne({ _id: id }, null, null, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      });
      // 查询最新三篇文章
      const articleList = new Promise((resolve, reject) => {
        Article.find({ status: 1 }, null, { sort: { createDate: -1 }, limit: 3 }, (error, result) => {
          if (error) reject(error);
          resolve(result);
        });
      })
      Promise.all([beCommenterInfo, articleInfo, commentInfo, articleList]).then(result => {
        // 向被回复者发送邮件
        const template = ejs.compile(fs.readFileSync(path.join(__dirname, '../../../views/email.ejs'), 'utf8'));
        const mdDoc = md.render(result[2].content);
        const mdReplyDoc = md.render(content);
        const { userInfo: { name } } = config;
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
      res.send({
        code: 0,
        msg: '回复成功'
      });
    }
  });
});

module.exports = router;

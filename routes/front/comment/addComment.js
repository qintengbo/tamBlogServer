const express = require('express');
const router = express.Router();
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const Comment = require('../../../models/comment');
const Visitor = require('../../../models/visitor');
const sendMail = require('../../../services/sendMail');

// 新增评论接口
router.post('/addComment', (req, res) => {
  // 判断验证码是否正确
  if (req.body.imgCode !== req.session.captcha) {
    return res.send({
      code: -2,
      msg: '验证码错误'
    });
  }
  // 保存评论前先保存评论者的信息
  Visitor.findOne({ email: req.body.email }, null, null, (err, collection) => {
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
    const { content, relationId, beCommenter, isMain, commentId } = param;
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
        return res.send({
          code: -1,
          msg: '回复失败'
        });
      }
      // 如果是子评论则往主评论中添加
      if (!isMain) { 
        Comment.findOneAndUpdate({ _id: commentId }, { $addToSet: { reply: doc._id } }, { new: true }, (error, docs) => {
          if (error) throw error;
        });
        // 向被回复者发送邮件
        const template = ejs.compile(fs.readFileSync(path.join(__dirname, '../../../views/email.ejs'), 'utf8'));
        const html = template({});
        Visitor.findOne({ _id: beCommenter }, null, null, (er, result) => {
          if (er) throw er;
          sendMail(result.email, '叮咚！你有一条新的回复消息', html);
        });
      }
      res.send({
        code: 0,
        msg: '回复成功'
      });
    });
  }
});

module.exports = router;

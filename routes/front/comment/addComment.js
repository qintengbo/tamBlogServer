const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');
const Visitor = require('../../../models/visitor');

// 新增评论接口
router.post('/addComment', (req, res) => {
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
    const { content, articleId, beCommenter, isMain, commentId } = param;
    let commentData = {};
    if (isMain) {
      commentData = {
        articleId,
        content,
        commenter: id,
      };
    } else {
      commentData = {
        articleId,
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
      }
      res.send({
        code: 0,
        msg: '回复成功'
      });
    });
  }
});

module.exports = router;

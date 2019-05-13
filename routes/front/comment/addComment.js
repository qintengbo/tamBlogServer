const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');

// 新增评论接口
router.post('/addComment', (req, res) => {
  Comment.create(req.query, (err, collection) => {
    if (err) {
      return res.send({
        code: -1,
        msg: '回复失败'
      });
    }
    res.send({
      code: 0,
      msg: '回复成功'
    });
  });
});

module.exports = router;

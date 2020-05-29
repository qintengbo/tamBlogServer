const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 新增文章接口
router.post('/addArticle', (req, res) => {
  Article.create(req.body, err => {
    if (err) {
      return res.send({
        code: -1,
        msg: '提交表单失败'
      });
    }
    res.send({
      code: 0,
      msg: '提交表单成功'
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章列表接口
router.get('/articleList', (req, res) => {
  Article.find((err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取文章列表成功',
      data: {
        list: collection
      }
    })
  });
});

module.exports = router;
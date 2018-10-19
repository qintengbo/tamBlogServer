const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章详细信息接口
router.get('/articleInfo', (req, res) => {
  Article.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) {
      res.send({
        code: -1,
        msg: '查询文章详细信息失败'
      });
    } else {
      res.send({
        code: 0,
        msg: '查询文章详细信息成功',
        data: collection
      });
    }
  });
});

module.exports = router;

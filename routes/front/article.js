const express = require('express');
const router = express.Router();
const Article = require('../../models/article');

// 已上线文章列表接口
router.get('/article', (req, res) => {
  Article.find({ status: 1 }, null, { sort: { updateDate: -1 } }, (err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取文章列表成功',
      data: {
        list: collection
      }
    });
  });
});

module.exports = router;

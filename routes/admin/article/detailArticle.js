const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 编辑文章接口
router.put('/detailArticle', (req, res) => {
  Article.updateOne({ _id: req.body.id }, {
    title: req.body.title,
    classification: req.body.classification,
    tag: req.body.tag,
    content: req.body.content,
    status: req.body.status,
    $currentDate: { date: true }
  }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '编辑文章成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '编辑文章失败'
      });
    }
  });
});

module.exports = router;

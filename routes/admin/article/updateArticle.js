const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 更新文章状态接口
router.put('/updateArticle', (req, res) => {
  Article.updateOne({ _id: req.body.id }, 
  { status: req.body.status, $currentDate: { date: true } }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '更新文章状态成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '更新文章状态失败'
      });
    }
  });
});

module.exports = router;
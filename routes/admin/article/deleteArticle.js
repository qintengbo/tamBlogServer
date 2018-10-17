const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 删除文章接口
router.delete('/deleteArticle', (req, res) => {
  Article.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) throw err;
    // 只能删除未发布文章
    if (collection.status === 2) {
      Article.remove({ _id: req.query.id }, err => {
        if (err) {
          res.send({
            code: -1,
            msg: '删除文章失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除文章成功'
          });
        }
      });
    } else {
      res.send({
        code: -2,
        msg: '已发布文章不能删除'
      });
    }
  });
});

module.exports = router;

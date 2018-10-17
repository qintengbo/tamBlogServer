const express = require('express');
const router = express.Router();
const Tag = require('../../../models/tag');

// 删除标签接口
router.delete('/deleteTag', (req, res) => {
  Tag.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) throw err;
    // 只能删除文章数不为0的标签
    if (collection.articleNum === 0) {
      Tag.remove({ _id: req.query.id }, err => {
        if (err) {
          res.send({
            code: -1,
            msg: '删除标签失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除标签成功'
          });
        }
      });
    } else {
      res.send({
        code: -2,
        msg: '文章数不为0的标签不能删除'
      });
    }
  });
});

module.exports = router;

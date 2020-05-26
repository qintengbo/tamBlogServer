const express = require('express');
const router = express.Router();
const Classification = require('../../../models/classification');

// 删除分类接口
router.delete('/deleteClassification', (req, res) => {
  Classification.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) throw err;
    // 只能删除文章数不为0的分类
    if (collection.articleNum === 0) {
      Classification.deleteOne({ _id: req.query.id }, err => {
        if (err) {
          res.send({
            code: -1,
            msg: '删除分类失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除分类成功'
          });
        }
      });
    } else {
      res.send({
        code: -2,
        msg: '文章数不为0的分类不能删除'
      });
    }
  });
});

module.exports = router;

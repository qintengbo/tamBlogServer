const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

// 删除轮播图接口
router.delete('/deleteBanner', (req, res) => {
  Banner.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) throw err;
    // 只能删除未上播轮播图
    if (collection.status === 2) {
      Banner.remove({ _id: req.query.id }, err => {
        if (err) {
          res.send({
            code: -1,
            msg: '删除轮播图失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除轮播图成功'
          });
        }
      });
    } else {
      res.send({
        code: -2,
        msg: '已上播轮播图不能删除'
      });
    }
  });
});

module.exports = router;

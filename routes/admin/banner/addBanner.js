const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

// 新增轮播图接口
router.post('/addBanner', (req, res) => {
  Banner.create(req.body, (err, collection) => {
    if (err) {
      return res.send({
        code: -1,
        msg: '新增轮播图失败'
      });
    }
    res.send({
      code: 0,
      msg: '新增轮播图成功'
    });
  });
});

module.exports = router;

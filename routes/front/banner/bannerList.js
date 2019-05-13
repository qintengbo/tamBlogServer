const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

// 已上线播轮播图列表接口
router.get('/bannerList', (req, res) => {
  Banner.find({ status: 1 }, null, { sort: { order: 1 } }, (err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取轮播图成功',
      data: {
        list: collection
      }
    });
  });
});

module.exports = router;

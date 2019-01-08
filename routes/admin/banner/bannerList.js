const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

router.get('/bannerList', (req, res) => {
  Banner.find(
    { status: req.query.status === 'null' ? { $gt: 0 } : Number(req.query.status) },
    null, 
    { sort: { order: 1 } },
    (err, collection) => {
      if (err) throw err;
      res.send({
        code: 0,
        msg: '获取轮播图列表成功',
        data: {
          list: collection
        }
      });
    });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

// 编辑轮播图接口
router.put('/detailBanner', (req, res) => {
  Banner.updateOne({ _id: req.body.id }, { 
    mainTitle: req.body.mainTitle, 
    subtitle: req.body.subtitle, 
    imgUrl: req.body.imgUrl,
    order: req.body.order,
    status: req.body.status,
    $currentDate: { updateDate: true }
  }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '编辑轮播图成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '编辑轮播图失败'
      });
    }
  });
});

module.exports = router;

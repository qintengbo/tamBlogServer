const express = require('express');
const router = express.Router();
const Banner = require('../../../models/banner');

// 更新轮播图状态接口
router.put('/updateBanner', (req, res) => {
  Banner.updateOne({ _id: req.body.id },
  { status: req.body.status, $currentDate: { updateDate: true } }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '更新轮播图状态成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '更新轮播图状态失败'
      });
    }
  });
});

module.exports = router;

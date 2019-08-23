const express = require('express');
const router = express.Router();
const SteppingPit = require('../../../models/steppingPit');

// 更新踩坑状态接口
router.put('/updateSteppingPit', (req, res) => {
  SteppingPit.updateOne({ _id: req.body.id }, 
  { status: req.body.status, $currentDate: { updateDate: true } }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '更新踩坑状态成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '更新踩坑状态失败'
      });
    }
  });
});

module.exports = router;

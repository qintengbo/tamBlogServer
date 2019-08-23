const express = require('express');
const router = express.Router();
const SteppingPit = require('../../../models/steppingPit');

// 编辑踩坑接口
router.put('/detailSteppingPit', (req, res) => {
  SteppingPit.updateOne({ _id: req.body.id }, {
    title: req.body.title,
    description: req.body.description,
    solution: req.body.solution,
    version: req.body.version,
    status: req.body.status,
    $currentDate: { updateDate: true }
  }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '编辑踩坑成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '编辑踩坑失败'
      });
    }
  });
});

module.exports = router;

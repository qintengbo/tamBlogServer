const express = require('express');
const router = express.Router();
const SteppingPit = require('../../../models/steppingPit');

// 新增踩坑接口
router.post('/addSteppingPit', (req, res) => {
  SteppingPit.create(req.body, (err, collection) => {
    if (err) {
      return res.send({
        code: -1,
        msg: '提交表单失败'
      });
    }
    res.send({
      code: 0,
      msg: '提交表单成功'
    });
  });
});

module.exports = router;

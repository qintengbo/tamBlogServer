const express = require('express');
const router = express.Router();
const BuriedPoint = require('../../../models/buriedPoint');

// 前台访问量接口
router.post('/addViews', (_, res) => {
  BuriedPoint.findOneAndUpdate({}, { $inc: { views: 1 } }, (err, doc) => {
    if (err) {
      const { message } = err;
      return res.send({
        code: -1,
        msg: message
      });
    }
    if (!doc) {
      BuriedPoint.create({}, error => {
        if (error) {
          const { message } = error;
          return res.send({
            code: -1,
            msg: message
          });
        }
        res.send({
          code: 0,
          msg: '新增访问量成功'
        });
      });
    } else {
      res.send({
        code: 0,
        msg: '新增访问量成功'
      });
    }
  });
});

module.exports = router;

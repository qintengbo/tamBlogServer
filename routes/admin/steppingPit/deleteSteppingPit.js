const express = require('express');
const router = express.Router();
const SteppingPit = require('../../../models/steppingPit');

// 删除踩坑接口
router.delete('/deleteSteppingPit', (req, res) => {
  SteppingPit.findOne({ _id: req.query.id }, (err, collection) => {
    if (err) throw err;
    // 只能删除未发布的踩坑记录
    if (collection.status === 2) {
      SteppingPit.remove({ _id: req.query.id }, err => {
        if (err) {
          res.send({
            code: -1,
            msg: '删除踩坑失败'
          });
        } else {
          res.send({
            code: 0,
            msg: '删除踩坑成功'
          });
        }
      });
    } else {
      res.send({
        code: -2,
        msg: '已发布踩坑不能删除'
      });
    }
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Tag = require('../../../models/tag');

// 编辑标签接口
router.put('/detailTag', (req, res) => {
  Tag.updateOne({ _id: req.body.id },
    { name: req.body.name, abbreviationName: req.body.abbreviationName, $currentDate: { date: true } }, (err, raw) => {
      if (err) throw err;
      if (raw.ok === 1) {
        res.send({
          code: 0,
          msg: '编辑标签成功'
        });
      } else {
        res.send({
          code: -1,
          msg: '编辑标签失败'
        });
      }
    });
});

module.exports = router;

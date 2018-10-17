const express = require('express');
const router = express.Router();
const Classification = require('../../../models/classification');

// 编辑分类接口
router.put('/detailClassification', (req, res) => {
  Classification.updateOne({ _id: req.body.id },
  { name: req.body.name, abbreviationName: req.body.abbreviationName, $currentDate: { date: true } }, (err, raw) => {
    if (err) throw err;
    if (raw.ok === 1) {
      res.send({
        code: 0,
        msg: '编辑分类成功'
      });
    } else {
      res.send({
        code: -1,
        msg: '编辑分类失败'
      });
    }
  });
});

module.exports = router;

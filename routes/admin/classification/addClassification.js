const express = require('express');
const router = express.Router();
const Classification = require('../../../models/classification');

// 新增分类接口
router.post('/addClassification', (req, res) => {
  Classification.create(req.body, (err, collection) => {
    if (err) {
      res.send({
        code: -1,
        msg: '新增分类失败'
      });
    } else {
      res.send({
        code: 0,
        msg: '新增分类成功'
      });
    }
  });
});

module.exports = router;
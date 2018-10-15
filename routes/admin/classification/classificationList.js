const express = require('express');
const router = express.Router();
const Classification = require('../../../models/classification');

// 查询分类列表接口
router.get('/classificationList', (req, res) => {
  Classification.find((err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取分类列表成功',
      data: {
        list: collection
      }
    });
  });
});

module.exports = router;

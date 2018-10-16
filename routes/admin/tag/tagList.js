const express = require('express');
const router = express.Router();
const Tag = require('../../../models/tag');

// 查询标签列表接口
router.get('/tagList', (req, res) => {
  Tag.find((err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取标签列表成功',
      data: {
        list: collection
      }
    });
  });
});

module.exports = router;

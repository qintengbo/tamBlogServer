const express = require('express');
const router = express.Router();
const Tag = require('../../../models/tag');

// 新增标签接口
router.post('/addTag', (req, res) => {
  Tag.create(req.body, (err, collection) => {
    if (err) {
      res.send({
        code: -1,
        msg: '新增标签失败'
      });
    } else {
      res.send({
        code: 0,
        msg: '新增标签成功'
      });
    }
  });
});

module.exports = router;

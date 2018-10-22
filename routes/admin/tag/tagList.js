const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Tag = require('../../../models/tag');

// 查询标签列表接口
router.get('/tagList', (req, res) => {
  // 查询文章集合中标签引用次数
  Article.aggregate([
    { $unwind: '$tag' },
    { $group: { _id: '$tag', count: { $sum: 1 } } }
  ]).then(doc => {
    doc.forEach(item => {
      // 更新文章数
      Tag.updateOne({ _id: item._id }, { articleNum: item.count }, (err, raw) => {
        if (err) throw err;
      });
    });
  });
  Tag.find({ name: { $regex: req.query.keyWord } }, null, { sort: { date: -1 } }, (err, collection) => {
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

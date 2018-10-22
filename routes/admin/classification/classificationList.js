const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Classification = require('../../../models/classification');

// 查询分类列表接口
router.get('/classificationList', (req, res) => {
  // 查询文章集合中分类引用次数
  Article.aggregate([
    { $group: { _id: '$classification', count: { $sum: 1 } } }
  ]).then(doc => {
    doc.forEach(item => {
      // 更新文章数
      Classification.updateOne({ _id: item._id }, { articleNum: item.count }, (err, raw) => {
        if (err) throw err;
      });
    });
  });
  Classification.find({ name: { $regex: req.query.keyWord } }, null, { sort: { date: -1 } }, (err, collection) => {
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

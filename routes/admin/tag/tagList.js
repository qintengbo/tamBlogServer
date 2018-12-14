const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Tag = require('../../../models/tag');

// 查询标签列表接口
router.get('/tagList', (req, res) => {
  // 查询文章集合中标签引用次数
  Article.aggregate([
    { $unwind: '$tag' },
    { $group: { _id: '$tag', countDocuments: { $sum: 1 } } }
  ]).then(doc => {
    let arr = [];
    Tag.find(null, null, { select: '_id' }, (err, collection) => {
      if (err) throw err;
      collection.forEach(val => {
        let num = doc.findIndex(n => n._id.toString() === val._id.toString());
        if (num !== -1) {
          arr.push(doc[num]);
        } else {
          // 文章未使用的标签文章数要更新为0
          arr.push({ _id: val._id, countDocuments: 0 });
        }
      });
      arr.forEach(item => {
        // 更新文章数
        Tag.updateOne({ _id: item._id }, { articleNum: item.countDocuments }, (err, raw) => {
          if (err) throw err;
        });
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

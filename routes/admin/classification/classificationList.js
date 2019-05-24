const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Classification = require('../../../models/classification');

// 查询分类列表接口
router.get('/classificationList', (req, res) => {
  // 查询文章集合中分类引用次数
  Article.aggregate([
    { $group: { _id: '$classification', countDocuments: { $sum: 1 } } }
  ]).then(doc => {
    let arr = [];
    Classification.find(null, null, { select: '_id' }, (err, collection) => {
      if (err) throw err;
      collection.forEach(val => {
        let num = doc.findIndex(n => n._id.toString() === val._id.toString());
        if (num !== -1) {
          arr.push(doc[num]);
        } else {
          // 文章未使用的分类文章数要更新为0
          arr.push({ _id: val._id, countDocuments: 0 });
        }
      });
      arr.forEach(item => {
        // 更新文章数
        Classification.updateOne({ _id: item._id }, { articleNum: item.countDocuments }, (err, raw) => {
          if (err) throw err;
        });
      }); 
    });
  });
  const keyWord = req.query.keyWord || '';
  Classification.find({ name: { $regex: keyWord } }, null, { sort: { date: -1 } }, (err, collection) => {
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

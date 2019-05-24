const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Classification = require('../../../models/classification');

// 查询分类列表接口
router.get('/classificationList', (req, res) => {
  // 查询文章集合中分类引用次数
  Article.aggregate([
    { $match: { status: 1 } },
    { $group: { _id: '$classification', countDocuments: { $sum: 1 } } }
  ]).then(doc => {
    Classification.find(null, null, { sort: { date: -1 } }, (err, collection) => {
      if (err) throw err;
      collection.forEach(val => {
        let num = doc.findIndex(n => n._id.toString() === val._id.toString());
        if (num !== -1) {
          val.articleNum = doc[num].countDocuments;
        } else {
          val.articleNum = 0;
        }
      });
      res.send({
        code: 0,
        msg: '获取分类列表成功',
        data: {
          list: collection
        }
      });
    });
  });
});

module.exports = router;

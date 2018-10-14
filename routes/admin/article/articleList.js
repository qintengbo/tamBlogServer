const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章列表接口
router.get('/articleList', (req, res) => {
  console.log(req.query)
  // 查询数据库条件
  let params = {
    title: { $regex: req.query.keyWord },
    classification: req.query.classification === 'null' ? { $regex: '' } : req.query.classification,
    tag: req.query.tag === 'null' ? { $regex: '' } : req.query.tag,
    status: req.query.status === '0' ? { $gt: 0 } : Number(req.query.status),
  };
  // 判断是否有日期范围查询
  if (req.query.date !== '') {
    params.date = { $gte: req.query.date[0], $lte: req.query.date[1] };
  }
  Article.find(params, null, { sort: { _id: -1 } }, (err, collection) => {
    if (err) throw err;
    res.send({
      code: 0,
      msg: '获取文章列表成功',
      data: {
        list: collection,
        total: collection.length
      }
    })
  });
});

module.exports = router;
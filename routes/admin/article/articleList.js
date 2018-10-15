const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章列表接口
router.get('/articleList', (req, res) => {
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
  // 查询数据总条数
  let total;
  Article.find(params).count((err, count) => {
    if (err) throw err;
    total = count;
    // 查询时按时间先后顺序排序
    Article.find(params, null, {
      sort: { date: -1 }, 
      skip: (Number(req.query.page) - 1) * Number(req.query.size), 
      limit: Number(req.query.size) 
    }, (err, collection) => {
      if (err) throw err;
      res.send({
        code: 0,
        msg: '获取文章列表成功',
        data: {
          list: collection,
          total: total
        }
      });
    });
  });
});

module.exports = router;
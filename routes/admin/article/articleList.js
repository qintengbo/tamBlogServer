const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章列表接口
router.get('/articleList', (req, res) => {
  // 查询数据库条件
  let params = {
    title: { $regex: req.query.keyWord, $options: 'i' },
    status: req.query.status === '0' ? { $gt: 0 } : Number(req.query.status),
  };
  // 判断是否有日期范围查询
  if (req.query.date) {
    params.updateDate = { $gte: req.query.date[0], $lte: req.query.date[1] };
  }
  // 判断是否有分类查询
  if (req.query.classification !== 'null') {
    params.classification = req.query.classification;
  }
  // 判断是否有标签查询
  if (req.query.tag !== 'null') {
    params.tag = req.query.tag;
  }
  // 判断是否有排序
  let sort = {};
  if (req.query.sort !== 'null') {
    if (req.query.sort === 'ascend') {
      sort = { readNum: 1 };
    } else if (req.query.sort === 'descend') {
      sort = { readNum: -1 };
    }
  } else {
    sort = { updateDate: -1 };
  }
  // 查询数据总条数
  let total;
  Article.find(params).countDocuments((err, count) => {
    if (err) throw err;
    total = count;
    // 查询时按时间先后顺序排序
    Article.find(params, null, {
      sort: sort, 
      skip: (Number(req.query.page) - 1) * Number(req.query.size), 
      limit: Number(req.query.size),
      select: '-content'
    }, (err, collection) => {
      if (err) throw err;
      let opts = [
        { path: 'classification', select: 'name' },
        { path: 'tag', select: 'name' }
      ];
      Article.populate(collection, opts, (err, doc) => {
        if (err) throw err;
        res.send({
          code: 0,
          msg: '获取文章列表成功',
          data: {
            list: doc,
            total: total
          }
        });
      });
    });
  });
});

module.exports = router;

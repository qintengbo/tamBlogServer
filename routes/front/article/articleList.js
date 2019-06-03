const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 已上线文章列表接口
router.get('/articleList', (req, res) => {
  // 模糊查询
  let params = {
    title: { $regex: req.query.keyWord || '' },
    status: 1
  };
  // 判断是否有分类查询
  if (req.query.classification && req.query.classification !== 'null') {
    params.classification = req.query.classification;
  }
  // 判断是否有标签查询
  if (req.query.tag && req.query.tag !== 'null') {
    params.tag = req.query.tag;
  }
  // 查询数据总条数
  let total;
  Article.find(params).countDocuments((err, count) => {
    if (err) throw err;
    total = count;
    Article.find(params, null, { 
      sort: { updateDate: -1 },
      skip: (Number(req.query.page) - 1) * Number(req.query.size), 
      limit: Number(req.query.size)
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
            total
          }
        });
      });
    });
  });
});

module.exports = router;

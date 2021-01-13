const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Comment = require('../../../models/comment');
const Visitors = require('../../../models/visitors');

// 监控字段统计接口
router.get('/count', (_, res) => {
  // 查询昨日访问量
  const dateTime = new Date(new Date().toLocaleDateString()).getTime();
  const startDate = new Date(dateTime - 86400000);
  const endDate = new Date(dateTime - 1);
  const yesterdayTotal = new Promise((resolve, reject) => {
    Visitors.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询总访问量
  const accessTotal = new Promise((resolve, reject) => {
    Visitors.find().countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询昨日评论数
  const commentTotal = new Promise((resolve, reject) => {
    Comment.find({ createDate: { $gte: startDate, $lte: endDate } }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询昨日新增文章数
  const articleTotal = new Promise((resolve, reject) => {
    Article.find({ createDate: { $gte: startDate, $lte: endDate } }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  Promise.all([yesterdayTotal, accessTotal, commentTotal, articleTotal]).then(result => {
    res.send({
      code: 0,
      message: '查询成功',
      data: {
        accessTotalDay: result[0] || 0,
        accessTotal: result[1] || 0,
        commentTotal: result[2] || 0,
        articleTotal: result[3] || 0
      }
    });
  });
});

module.exports = router;

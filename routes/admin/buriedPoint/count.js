const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');
const Comment = require('../../../models/comment');
const Visitors = require('../../../models/visitors');

// 监控字段统计接口
router.get('/count', (req, res) => {
  // 查询昨日访问量
  const dateTime = new Date(new Date().toLocaleDateString()).getTime();
  const startDate = new Date(dateTime - 86400000);
  const endDate = new Date(dateTime - 1);
  const yesterdayTotal = new promise((resolve, reject) => {
    Visitors.find({ createdAt: { $gte: startDate, $lte: endDate } }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询总访问量
  const commentTotal = new Promise((resolve, reject) => {
    Visitors.find().countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询昨日评论数
  
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');

// 获取文章评论
router.get('/commentList', (req, res) => {
  // 查询评论总数
  const total = new Promise((resolve, reject) => {
    Comment.find({ articleId: req.query.articleId, show: true }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询主评论总数
  const mainTotal = new Promise((resolve, reject) => {
    Comment.find({ articleId: req.query.articleId, isMain: true, show: true }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  Promise.all([total, mainTotal]).then(result => {
    Comment.find({ articleId: req.query.articleId, isMain: true, show: true }, null, {
      sort: { createDate: -1 },
      skip: (Number(req.query.page) - 1) * Number(req.query.size), 
      limit: Number(req.query.size)
    }, (err, collection) => {
      if (err) throw err;
      let opts = [
        { path: 'commenter', select: 'name avatar' },
        { path: 'beCommenter', select: 'name' },
        { path: 'reply', populate: [{ path: 'commenter', select: 'name avatar' }, { path: 'beCommenter', select: 'name' }] }
      ];
      Comment.populate(collection, opts, (err, doc) => {
        if (err) throw err;
        res.send({
          code: 0,
          msg: '获取文章评论成功',
          data: {
            list: doc,
            total: result[0],
            mainTotal: result[1]
          }
        });
      });
    });
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');

// 获取评论列表
router.get('/commentList', (req, res) => {
  // 查询评论总数
  const total = new Promise((resolve, reject) => {
    Comment.find({ relationId: req.query.relationId, show: true }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  // 查询主评论总数
  const mainTotal = new Promise((resolve, reject) => {
    Comment.find({ relationId: req.query.relationId, isMain: true, show: true }).countDocuments((err, count) => {
      if (err) reject(err);
      resolve(count);
    });
  });
  Promise.all([total, mainTotal]).then(result => {
    Comment.find({ relationId: req.query.relationId, isMain: true, show: true }, null, {
      sort: { createDate: -1 },
      skip: (Number(req.query.page) - 1) * Number(req.query.size), 
      limit: Number(req.query.size)
    }, (err, collection) => {
      if (err) throw err;
      const opts = [
        { path: 'commenter', select: 'name avatar' },
        { path: 'beCommenter', select: 'name' },
        { 
					path: 'reply', populate: [
						{ path: 'commenter', select: 'name avatar' }, 
						{ path: 'beCommenter', select: 'name' }
          ],
          match: { show: true }, 
				}
      ];
      Comment.populate(collection, opts, (err, doc) => {
        if (err) throw err;
        // 增加子评论数量字段
        const docList = doc.map(item => {
          const { reply } = item;
          const list = JSON.parse(JSON.stringify(reply));
          const val = {
            ...item._doc,
            replyTotal: reply.length,
            childPage: 1, // 子评论当前页数
            reply: reply.length > 3 ? list.slice(0, 3) : list,
          }
          return val;
        });
        res.send({
          code: 0,
          msg: '获取文章评论成功',
          data: {
            list: docList,
            total: result[0],
            mainTotal: result[1]
          }
        });
      });
    });
  });
});

module.exports = router;

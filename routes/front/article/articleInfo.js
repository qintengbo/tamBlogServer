const express = require('express');
const router = express.Router();
const Article = require('../../../models/article');

// 查询文章详细信息接口
router.get('/articleInfo', (req, res) => {
  // 文章阅读数+1
  Article.findOneAndUpdate({ _id: req.query.id }, { $inc: { readNum: 1 } }, { new: true }, (err, collection) => {
    if (err) {
      res.send({
        code: -1,
        msg: '查询文章详细信息失败'
      });
    } else {
      // 查询上一篇和下一篇文章id
      const preId = new Promise((resolve, reject) => {
        Article.find({ updateDate: { $gt: collection.updateDate } }, '_id', { sort: { updateDate: -1 }, limit: 1 }, (err, preDoc) => {
          if (err) reject(err);
          let id = '';
          if (preDoc.length > 0) {
            id = preDoc[0]._id;
          }
          resolve(id);
        });
      });
      const nxtId = new Promise((resolve, reject) => {
        Article.find({ updateDate: { $lt: collection.updateDate } }, '_id', { sort: { updateDate: -1 }, limit: 1 }, (err, nxtDoc) => {
          if (err) reject(err);
          let id = '';
          if (nxtDoc.length > 0) {
            id = nxtDoc[0]._id;
          }
          resolve(id);
        });
      });
      Promise.all([preId, nxtId]).then(result => {
        res.send({
          code: 0,
          msg: '查询文章详细信息成功',
          data: {
            articleData: collection,
            preId: result[0],
            nxtId: result[1]
          }
        });
      });
    }
  });
});

module.exports = router;

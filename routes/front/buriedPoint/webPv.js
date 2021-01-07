const express = require('express');
const router = express.Router();
const CryptoJs = require('crypto-js');
const Visitors = require('../../../models/visitors');
const config = require('../../../config/config');
const { AES, enc } = CryptoJs;

// 新增访问接口
router.post('/webPv', (req, res) => {
  const { t } = req.body;
  // AES解密
  const bytes = AES.decrypt(t, config.secret);
  const cipherText = JSON.parse(enc.Utf8.stringify(bytes));
  const ip = req.ip.replace('::ffff:', '');
  const params = {
    ...cipherText,
    ip
  };
  // 获取今日的开始时间
  const dateTime = new Date(new Date().toLocaleDateString()).getTime();
  const startDate = new Date(dateTime);
  // 查询该ip今日是否已访问过，如访问过则不保存该访问记录
  Visitors.findOne({ ip, createdAt: { $gte: startDate, $lte: new Date() } }, null, null, (err, docs) => {
    if (err) {
      const { message } = err;
      return res.send({
        code: -1,
        msg: '保存失败',
        error: message
      });
    }
    if (docs) {
      return res.send({
        code: 0,
        msg: '保存成功'
      });
    } else {
      Visitors.create(params, error => {
        if (error) {
          const { message } = error;
          return res.send({
            code: -1,
            msg: '保存失败',
            error: message
          });
        }
        res.send({
          code: 0,
          msg: '保存成功'
        });
      });
    }
  });
});

module.exports = router;

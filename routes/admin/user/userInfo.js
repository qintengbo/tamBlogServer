const express = require('express');
const router = express.Router();

// 获取用户信息
router.get('/userInfo', (req, res) => {
  res.send({
    code: 0,
    username: req.user.username,
    msg: '获取用户信息成功'
  });
});

module.exports = router;
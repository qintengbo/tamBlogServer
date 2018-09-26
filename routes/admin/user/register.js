const express = require('express');
const router = express.Router();
const User = require('../../../models/user');

// 注册账号
router.post('/signup', (req, res) => {
  if (!req.query.username || !req.query.password) {
    res.send({
      code: -1,
      msg: '请输入您的用户名和密码'
    });
  } else {
    let newUser = new User({
      username: req.query.username,
      password: req.query.password
    });
    // 保存用户账号密码
    newUser.save(err => {
      if (err) {
        return res.send({
          code: -2,
          msg: '注册失败'
        })
      }
      res.send({
        code: 0,
        msg: '注册成功'
      });
    })
  }
});

module.exports = router;

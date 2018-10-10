const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); 
const config = require('../../../config');
const User = require('../../../models/user');

// 登录接口
router.post('/login', (req, res, next) => {
  User.findOne({
    username: req.body.username
  }, (err, collection) => {
    if (err) throw err;
    // 检查用户是否存在
    if (!collection) {
      res.send({
        code: -1,
        msg: '用户不存在'
      });
    } else {
      // 检查密码是否正确
      collection.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          let token = jwt.sign({
            username: collection.username
          }, config.secret, {
            expiresIn: '12h' // token过期时间为12h
          });
          collection.token = token;
          collection.save((err) => {
            if (err) throw err;
          });
          res.send({
            code: 0,
            token: 'Bearer ' + token,
            msg: '登录成功'
          });
        } else {
          res.send({
            code: -2,
            msg: '密码错误'
          });
        }
      });
    }
  });
});

module.exports = router;
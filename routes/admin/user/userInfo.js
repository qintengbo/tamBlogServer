const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../../../passport')(passport);

// 获取用户信息
router.get('/userInfo', 
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    if (req.user.code === -1) {
      res.send({
        code: req.user.code,
        msg: req.user.msg
      });
    } else {
      res.send({
        code: 0,
        username: req.user.username,
        msg: '获取用户信息成功'
      });
    }
  });

module.exports = router;
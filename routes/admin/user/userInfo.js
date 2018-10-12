const express = require('express');
const router = express.Router();
const passport = require('passport');

require('../../../config/passport')(passport);

// 获取用户信息
router.get('/userInfo', 
  passport.authenticate('bearer', { session: false }),
  (req, res) => {
    console.log(req.user)
    if (req.user.code && req.user.code !== 0) {
      res.send(req.user);
    } else {
      res.send({
        code: 0,
        username: req.user.username,
        msg: '获取用户信息成功'
      });
    }
  });

module.exports = router;
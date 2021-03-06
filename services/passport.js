const Strategy = require('passport-http-bearer').Strategy; // token验证模块
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const config = require('../config/config');

// 验证token是否和数据库的token匹配
module.exports = function(passport) {
  passport.use(new Strategy(
    function(token, done) {
			if (!token) {
				return done(null, {
					code: -90,
					msg: '请先登录'
				});
			}
      User.findOne({ token: token }, function(err, user) {
        if (err) {
          return done(err);
        }
        // 若数据库无法查询到token,则用户不存在
        if (!user) {
          return done(null, {
            code: -100,
            msg: '账号不存在，请先登录'
          });
        } else {
          // 判断token是否已过有效期
          jwt.verify(token, config.secret, (err, decoded) => {
						if (err) throw err;
            if (!decoded) {
              return done(null, {
                code: -110,
                msg: '账号已过期，请重新登录'
              });
            } else {
              return done(null, user);
            }
          });
        }
      });
    }
  ));
};

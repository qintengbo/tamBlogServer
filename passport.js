const passport = require('passport');
const Strategy = require('passport-http-bearer').Strategy; // token验证模块

const User = require('./models/user');
const config = require('./config');

// 验证token是否和数据库的token匹配
module.exports = function(passport) {
  passport.use(new Strategy(
    function(token, done) {
      User.findOne({
        token: token
      }, function(err, user) {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, {
            code: -1,
            msg: '账号不存在，请先登录'
          });
        }
        return done(null, user);
      });
    }
  ));
};

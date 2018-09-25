/**
 *后台接口
 */
module.exports = (app) => {
  var loginRouter = require('./routes/admin/login'); // 后台登录接口

  app.use('/login', loginRouter);
};

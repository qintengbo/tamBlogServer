const passport = require('passport');
require('../config/passport')(passport);

const routes = [
  require('./admin/user/login'), // 后台登录接口
  require('./admin/user/register'), // 注册接口
  require('./admin/user/userInfo'), // 获取用户信息接口
  require('./admin/common/uploadFile'), // 上传文件接口
  require('./admin/article/addArticle'), // 保存文章接口
  require('./admin/article/articleList'), // 查询文章列表接口
];

module.exports = (app) => {
  // 全局路由设置，验证token有效性，登录和注册除外
  app.all('/admin/*', (req, res, next) => {
    if (req.params['0'] === 'login' || req.params['0'] === 'signup') {
      next();
    } else {
      passport.authenticate('bearer', { session: false }, (err, user, info) => {
        if (user.code && user.code !== 0) {
          return res.send(user);
        } 
        req.user = user; // 向req中添加user字段，方便下一个中间件调用
        next();
      })(req, res, next);
    }
  });

  app.get('/', (req, res, next) => {
    res.render('index', { title: 'TamBlog' });
  });

  // 在所有后台路由前加'/admin'
  app.use('/admin', ...routes);
};
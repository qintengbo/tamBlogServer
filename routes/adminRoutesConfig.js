const routes = [
  require('./admin/user/login'), // 后台登录接口
  require('./admin/user/register'), // 注册接口
  require('./admin/user/userInfo'), // 获取用户信息接口
  require('./admin/common/uploadFile'), // 上传文件接口
]

module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('index', { title: 'TamBlog' });
  });

  // 在所有admin路由前加'/admin'
  app.use('/admin', ...routes);
};
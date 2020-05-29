const passport = require('passport');
require('../services/passport')(passport);

const routes = [
  require('./admin/user/login'), // 后台登录接口
  require('./admin/user/register'), // 注册接口
	require('./admin/user/userInfo'), // 获取用户信息接口
	require('./admin/user/logout'), // 退出登录接口
  require('./admin/common/uploadFile'), // 上传文件接口
  require('./admin/article/addArticle'), // 保存文章接口
  require('./admin/article/articleList'), // 查询文章列表接口
  require('./admin/article/updateArticle'), // 更新文章状态接口
  require('./admin/article/deleteArticle'), // 删除文章接口
  require('./admin/article/articleInfo'), // 查询文章详细信息接口
  require('./admin/article/detailArticle'), // 编辑文章接口
  require('./admin/classification/addClassification'), // 新增分类接口
  require('./admin/classification/classificationList'), // 查询分类列表接口
  require('./admin/classification/detailClassification'), // 编辑分类接口
  require('./admin/classification/deleteClassification'), // 删除分类接口
  require('./admin/tag/addTag'), // 新增标签接口
  require('./admin/tag/tagList'), // 查询标签列表接口
  require('./admin/tag/detailTag'), // 编辑标签接口
  require('./admin/tag/deleteTag'), // 删除标签接口
  require('./admin/banner/addBanner'), // 新增轮播图接口
  require('./admin/banner/bannerList'), // 查询轮播图列表接口
  require('./admin/banner/updateBanner'), // 更新轮播图状态接口
  require('./admin/banner/deleteBanner'), // 删除轮播图接口
	require('./admin/banner/detailBanner'), // 编辑轮播图接口
	require('./admin/comment/commentList'), // 查询评论列表接口
	require('./admin/comment/updateComment'), // 更改评论接口
];

module.exports = (app) => {
  // 全局路由设置，验证token有效性，登录除外
  app.all('/admin/*', (req, res, next) => {
    if (req.params['0'] === 'login') {
      next();
    } else {
      if (!req.headers.authorization) {
        return res.send({
          code: -90,
          msg: '请先登录'
        });
      }
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
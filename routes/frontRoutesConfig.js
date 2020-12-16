const routes = [
  require('./front/banner/bannerList'), // 轮播图列表接口
  require('./front/article/articleList'), // 文章列表接口
  require('./front/comment/addComment'), // 新增评论接口
	require('./front/comment/commentList'), // 评论列表接口
	require('./front/comment/childCommentList'), // 子评论列表接口
  require('./front/classification/classificationList'), // 查询分类列表接口
  require('./front/article/articleInfo'), // 文章详情接口
  require('./front/common/captcha'), // 图片验证码接口
  // require('./front/buriedPoint/views'), // 访问量接口
];

module.exports = (app) => {
  // 在所有前台路由前加'/front'
  app.use('/front', ...routes);
};

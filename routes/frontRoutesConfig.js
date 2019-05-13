const passport = require('passport');
require('../config/passport')(passport);

const routes = [
  require('./front/banner/bannerList.js'), // 轮播图列表接口
  require('./front/article/articleList.js'), // 文章列表接口
  require('./front/comment/addComment.js'), // 新增评论接口
];

module.exports = (app) => {
  // 在所有前台路由前加'/front'
  app.use('/front', ...routes);
};

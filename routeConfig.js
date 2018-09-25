module.exports = (app) => {
  app.get('/', (req, res, next) => {
    res.render('index', { title: 'TamBlog' });
  });

  // 在所有admin路由前加'/admin'
  app.use('/admin', require('./routes/admin/adminRoutes'));
};
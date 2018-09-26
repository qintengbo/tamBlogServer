const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan'); // 命令行log显示
const bodyParser = require('body-parser'); // 接收POST请求参数所用
const mongoose = require('mongoose');
const passport = require('passport'); // 用户认证模块
const config = require('./config'); // 全局配置
const adminRoutes = require('./routes/adminRoutesConfig'); // 路由配置

let port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // 解析POST请求携带的参数为JSON格式
app.use(passport.initialize()); // 初始化passport模块

adminRoutes(app); // 后台路由引入

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(config.dbPath);

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// 监听3000端口，启动方式: supervisor app.js
app.listen(port, () => {
  console.log('listening on port: ' + port);
});

module.exports = app;

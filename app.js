const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan'); // 命令行log显示
const bodyParser = require('body-parser'); // 接收POST请求参数所用
const mongoose = require('mongoose');
const passport = require('passport'); // 用户认证模块
const session = require('express-session'); // express-session模块
const config = require('./config/config'); // 全局配置
const adminRoutes = require('./routes/adminRoutesConfig'); // 后台路由配置
const frontRoutes = require('./routes/frontRoutesConfig'); // 前台路由配置

// 端口设置
let port = process.env.PORT || 3000;

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('trust proxy', true); // 设置请求ip获取位置

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); // 静态资源托管目录
app.use(bodyParser.json()); // 解析POST请求携带的参数为JSON格式
app.use(passport.initialize()); // 初始化passport模块
app.use(session(config.sessionConfig)); // 初始化express-session模块

adminRoutes(app); // 后台路由引入
frontRoutes(app); // 前台路由引入

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// mongoose设置
mongoose.set('useFindAndModify', false);
// 连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(config.dbPath, { useNewUrlParser: true });

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

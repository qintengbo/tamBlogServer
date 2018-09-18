var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser'); // 接收POST请求参数所用

/**
 * 路由信息
 */
var indexRouter = require('./routes/index'); // homePage 接口
// 后台路由
var usersRouter = require('./routes/users'); // 用户接口
var loginRouter = require('./routes/admin/login'); // 后台登录接口

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json()); // 解析POST请求携带的参数为JSON格式

/**
 * 接口信息
 */
app.use('/', indexRouter);
// 后台接口
app.use('/users', usersRouter);
app.use('/admin/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

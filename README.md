# 个人博客后端服务

该项目是我博客的后端服务，采用 `NodeJs` + `Express` + `MongoDB` 架构，前台和后台接口均在本项目。

图片存储使用`七牛云`，用户验证使用 `Jwt`，自建评论系统，具有回复评论后自动发送邮件到对应人的邮箱里的功能。

## 使用方法

```bash
npm intall         // 安装依赖
supervisor app.js  // 启动项目，需要先安装supervisor
```

## 项目结构

```bash
├── config          配置
├── models          数据库model
├── public          静态资源
├── routes          接口源码
|   ├── admin       后台接口
|   └── front       前台接口
├── services        服务目录
├── views           邮件模板
└── package.json
```

> 由于安全原因，本仓库未上传 config 文件夹里的 `config.js` 和 `qnyConfig.js` 两个文件, 如果需要，可以发邮件到 `qintb@qintengbo.com`，我会第一时间发给你。

## 文档资源

NodeJs官方文档：[http://nodejs.cn/api/](http://nodejs.cn/api/)

Mongoose官方文档：[http://mongoosejs.net/docs/promises.html](http://mongoosejs.net/docs/promises.html)

Express官方文档：[http://expressjs.com/zh-cn/](http://expressjs.com/zh-cn/)

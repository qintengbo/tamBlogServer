const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bytes = require('bytes');
const options = require('../../../config/qnyConfig').options;
const uploadFile = require('../../../services/qnUploader');
const path = require('path');

// 设置文件保存位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../public/tmp'));
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
// 文件上传设置
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: bytes('4MB'), // 限制文件在4MB以内
    files: 2
  }
}).single('file');

// 上传文件接口
router.post('/uploadFile', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.send({
        code: -1,
        msg: '文件大小超过4MB'
      });
    } else {
      let params = {};
      params.scope = options.scope + ':' + req.file.originalname;
      params.deadline = options.deadline + Date.now();
      // 上传文件到七牛云
      uploadFile(params, req.file.originalname, req.file.path, (err, body, info) => {
        if (err) {
          res.send({
            code: -2,
            msg: '上传文件到七牛云失败'
          });
        } else {
          // 上传成功则删除本地文件
					fs.unlinkSync(req.file.path);
          res.send({
            code: 0,
            msg: '上传文件成功',
            data: {
							// imgUrl: 'http://cdn.qintengbo.com/' + body.key
							imgUrl: 'http://q9lkwjl1j.bkt.clouddn.com/' + body.key
            }
          });
        }
      });
    }
  });
});

module.exports = router;
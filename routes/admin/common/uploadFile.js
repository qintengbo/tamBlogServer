const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const bytes = require('bytes');
const options = require('../../../config/qnyConfig').options;
const uploadFile = require('../../../services/qnUploader');
const upyunUploadFile = require('../../../services/upyunUploader');
const config = require('../../../config/config');
const qiniuConfig = require('../../../config/qnyConfig');
const upyunConfig = require('../../../config/upyunConfig');
const path = require('path');

// 设置文件临时保存位置
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
    files: 1
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
			let type = req.file.mimetype.slice(req.file.mimetype.lastIndexOf('/') + 1);
			const isImg = 'jpg,png,jpeg,gif'.indexOf(type) !== -1;
			if (isImg) {
        const { cloudStorage } = config;
        // 根据云存储设置选择不同的上传方式
        if (cloudStorage === 'qiniu') {
          let params = {};
          params.scope = options.scope + ':' + req.file.filename;
          params.deadline = options.deadline + Date.now();
          // 上传文件到七牛云
          uploadFile(params, req.file.filename, req.file.path, (err, body) => {
            if (err) {
              res.send({
                code: -2,
                msg: '上传图片到七牛云失败'
              });
            } else {
              // 上传成功则删除本地文件
              fs.unlinkSync(req.file.path);
              res.send({  
                code: 0,
                msg: '上传图片成功',
                data: {
                  imgUrl: qiniuConfig.options.url + body.key
                }
              });
            }
          });
          return;
        }
        // 上传图片到又拍云
        upyunUploadFile(req.file.filename, req.file.path).then(data => {
          console.log(data)
          if (!data) {
            res.send({
              code: -2,
              msg: '上传图片到又拍云失败'
            });
          } else {
            // 上传成功则删除本地文件
            fs.unlinkSync(req.file.path);
            res.send({  
              code: 0,
              msg: '上传图片成功',
              data: {
                imgUrl: `${upyunConfig.url}/${req.file.filename}`
              }
            });
          }
        });
			} else {
				// 文档类型文件则读取文件内容
				fs.readFile(req.file.path, 'utf8', (error, data) => {
					if (error) {
						const { message } = error;
						return res.send({
							code: -1,
							msg: '上传文件失败',
							error: message
						});
					}
					// 上传成功则删除本地文件
					fs.unlinkSync(req.file.path);
					res.send({
						code: 0,
						data,
						msg: '上传文件成功'
					});
				});
			}
    }
  });
});

module.exports = router;
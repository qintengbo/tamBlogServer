const express = require('express');
const router = express.Router();
const multer = require('multer');
const bytes = require('bytes');

// 设置文件保存位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'tmp/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});
// 文件上传设置
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: bytes('4MB') // 限制文件在4MB以内
  }, 
  // fileFilter: function(req, files, callback) {
  //   // 只允许上传jpg|png|jpeg|gif格式的文件
  //   let type = '|' + files.mimetype.slice(files.mimetype.lastIndexOf('/') + 1) + '|';
  //   let fileTypeValid = '|jpg|png|jpeg|gif|'.indexOf(type) !== -1;
  //   callback(null, !!fileTypeValid);
  // }
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
      console.log(req.file)
      res.send({
        code: 0,
        msg: '上传成功',
        data: {
          imgUrl: req.file.path
        }
      });
    }
  });
});

module.exports = router;
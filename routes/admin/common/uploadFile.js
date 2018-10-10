const express = require('express');
const router = express.Router();
const multer = require('multer');
const bytes = require('bytes');

// 设置文件保存位置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/tmp/');
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
      // let type = req.file.mimetype.slice(req.file.mimetype.lastIndexOf('/') + 1);
      // console.log('jpg,png,jpeg,gif'.indexOf(type) !== -1)
      res.send({
        code: 0,
        msg: '上传成功',
        data: {
          imgUrl: 'http://localhost:3000/tmp/' + req.file.filename
        }
      });
    }
  });
});

module.exports = router;
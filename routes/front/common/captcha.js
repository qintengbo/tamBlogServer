const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');

// 获取图片验证码接口
router.get('/captchaCode', (req, res) => {
  const captchaConfig = {
    size: 5,
    ignoreChars: 'O01i', // 验证码字符中排除'O01i'
    noise: 2, // 干扰线条数量
  };
  const captcha = svgCaptcha.create(captchaConfig);
  req.session.captcha = captcha.text.toUpperCase();
  res.type('svg');
  res.send(captcha.data);
});

module.exports = router;

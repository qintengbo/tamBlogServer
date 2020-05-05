const express = require('express');
const router = express.Router();
const svgCaptcha = require('svg-captcha');
const path = require('path');

const fontUrl1 = path.join(__dirname, '../../../public/fonts/a-Arbei-Berry-3.ttf');
const fontUrl2 = path.join(__dirname, '../../../public/fonts/Career-2.ttf');
const fontUrl3 = path.join(__dirname, '../../../public/fonts/Golddrew-Demo-2.ttf');
const fontUrl4 = path.join(__dirname, '../../../public/fonts/Rosseta-3.ttf');
const fontUrl5 = path.join(__dirname, '../../../public/fonts/Bareona-2.ttf');
const fontUrlArr = [fontUrl1, fontUrl2, fontUrl3, fontUrl4, fontUrl5];

// 获取图片验证码接口
router.get('/captchaCode', (req, res) => {
  const captchaConfig = {
    size: 5,
    ignoreChars: 'O01i', // 验证码字符中排除'O01i'
		noise: 2, // 干扰线条数量
		fontSize: 40
	};
	// 五种字体随机获取一种
	const index = Math.floor(Math.random() * fontUrlArr.length);
	
	svgCaptcha.loadFont(fontUrlArr[index]);
	const captcha = svgCaptcha.create(captchaConfig);
	req.session.captcha = captcha.text.toUpperCase();
  res.type('svg');
  res.send(captcha.data);
});

module.exports = router;

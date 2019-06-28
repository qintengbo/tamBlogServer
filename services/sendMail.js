const nodemailer = require('nodemailer');
const config = require('../config/config');

module.exports = function(receiver, title, content) {
  let transporter = nodemailer.createTransport(config.mailConfig);
  transporter.sendMail({
    from: { // 发件人
      name: '覃腾波的个人博客',
      address: 'no-reply@qintengbo.com'
    },
    to: receiver, // 收件人
    subject: title, // 邮件主题
    html: content // 邮件内容
  }, (err, res) => {
    if (err) throw err;
  });
}

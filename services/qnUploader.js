const qiniu = require('qiniu');
const qiniuConfig = require('../config/qnyConfig');

// 七牛云上传文件
module.exports = function(options, key, localFile, callback) {
  // 生成鉴权对象mac
  const mac = new qiniu.auth.digest.Mac(qiniuConfig.config.accessKey, qiniuConfig.config.secretKey);
  const putPolicy = new qiniu.rs.PutPolicy(options);
  // 生成上传token
  let uploadToken = putPolicy.uploadToken(mac);
  const formUploader = new qiniu.form_up.FormUploader(new qiniu.conf.Config());
  const putExtra = new qiniu.form_up.PutExtra();
  // 上传文件
  formUploader.putFile(uploadToken, key, localFile, putExtra, callback);
};

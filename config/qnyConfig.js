const path = require('path');

// 七牛云配置文件
module.exports = {
  root: path.resolve(__dirname, '../'), //根目录
  serverUrl:'服务器地址',
  qiniu_config:{
    //需要填写你的 Access Key 和 Secret Key
    accessKey:'your accessKey',
    secretKey:'your secretKey',
    bucket: 'bucket',
    origin: '',
  }
}
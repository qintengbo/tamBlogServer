/*
 * @Author       : qintengbo
 * @Date         : 2020-12-16 17:32:05
 * @Description  : 又拍云认证鉴权
 */
const crypto = require('crypto');
const date = new Date().toUTCString();

/**
 * 认证鉴权函数
 * @param {string} key 操作员名称 
 * @param {string} secret 操作员密码 
 * @param {string} method 请求方式
 * @param {string} uri 请求地址 
 * @param {string} policy 上传参数的Base64编码，在使用FormAPI时才需要此参数
 * @param {string} md5 上传文件的MD5值，非必传
 * @return {string} Authorization签名
 */
module.exports = function(key, secret, method, uri, policy = null, md5 = null) {
  const list = [];
  [method, uri, date, policy, md5].forEach(item => {
    if (item !== null) {
      list.push(item);
    }
  });
  const secretMd5 = crypto.createHash('md5').update(secret).digest('hex');
  const value = list.join('&');
  const auth = crypto.createHmac('sha1', secretMd5).update(value, 'utf-8').digest().toString('base64');
  return `UPYUN ${key}:${auth}`;
}
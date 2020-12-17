const upyun = require('upyun');
const fs = require('fs');
const upyunConfig = require('../config/upyunConfig');

/**
 * 又拍云上传
 * @param {string} filename 文件名 
 * @param {string} path 文件本地路径
 * @return {boolean} 是否上传成功 
 */
module.exports = async function(filename, path) {
  const { bucket, operator, password } = upyunConfig;
  const service = new upyun.Service(bucket, operator, password);
  const client = new upyun.Client(service);
  const data = await client.putFile(filename, fs.createReadStream(path));
  console.log('data', data)
  if (data) {
    return true;
  }
  return false;
}

var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var path = require('../dbPath');

/* 登录接口 */
router.post('/', function(req, res, next) {
	var query = req.query;
	MongoClient.connect(path, function(err, client) {
	  if (err) throw err;
	  var db = client.db('test');
	  db.collection('user').find().toArray(function(err, response) {
	    if (err) throw err;
	    console.log(response);
	    if (response[0]['userName'] === query.userName && response[0]['password'] === query.password) {
        res.send({
          code: 0,
          msg: '登录成功',
          name: response[1]['name'],
          age: response[1]['age']
        });
      } else {
	      res.send({
          code: -1,
          msg: '账号或密码错误'
        });
      }
    })
  });
});

module.exports = router;
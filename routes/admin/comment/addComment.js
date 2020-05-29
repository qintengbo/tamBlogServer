/*
 * @Author       : qintengbo
 * @Date         : 2020-05-26 18:09:59
 * @LastEditors  : qintengbo
 * @LastEditTime : 2020-05-26 18:36:23
 * @Description  : 新增评论
 */ 
const express = require('express');
const router = express.Router();
const Comment = require('../../../models/comment');
const Visitor = require('../../../models/visitor');

router.post('/addComment', (req, res) => {
	
})
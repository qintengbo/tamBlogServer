const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 埋点集合字段
const BuriedPointSchema = new Schema({
  views: { // 访问量
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('BuriedPoint', BuriedPointSchema);

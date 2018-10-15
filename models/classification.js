const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 分类集合字段
const ClassificationSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  abbreviationName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Classification', ClassificationSchema);
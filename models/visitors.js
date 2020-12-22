const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 访客集合字段
const VisitorsSchema = new Schema({
  
});

module.exports = mongoose.model('Visitors', VisitorsSchema);

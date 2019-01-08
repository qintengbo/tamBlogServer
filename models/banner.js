const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// 轮播图集合字段
const BannerSchema = new Schema({
  mainTitle: { // 主标题
    type: String,
    require: true
  },
  subtitle: { // 副标题
    type: String,
    require: true
  },
  imgUrl: { // 图片地址
    type: String,
    require: true
  },
  order: {
    type: Number,
    require: true
  },
  status: { // 状态 1-已上播，2-未上播
    type: Number, 
    require: true
  },
  updateDate: { // 更新时间
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Banner', BannerSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

// 用户集合字段
const UserSchema = new Schema({
  username: { // 用户名
    type: String,
    required: true
  },
  password: { // 密码
    type: String,
    required: true
  },
	token: String,
	userInfo: { // 用户信息
		type: Schema.Types.ObjectId,
    ref: 'Commenter'
	}
});

// 添加用户保存时对password进行bcrypt加密
UserSchema.pre('save', function (next) {
  let user = this;
  if (this.isModified('password') || this.isNew) {
    // 加密
    bcrypt.genSalt(10, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        // 将加密后的hash值赋给用户密码
        user.password = hash;
        next();
      });
    });
  } else {
    return next();
  }
});
// 校验用户输入密码是否正确
UserSchema.methods.comparePassword = function(psw, callBack) {
  bcrypt.compare(psw, this.password, (err, res) => {
    if (err) {
      return callBack(err);
    }
    callBack(null, res);
  });
};

module.exports = mongoose.model('User', UserSchema);
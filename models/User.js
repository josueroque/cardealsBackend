'use strict';

const mongoose = require('mongoose');
var hash = require('hash.js');


const userSchema = mongoose.Schema({
  name:String,
  nickname:{ type: String, unique: true },
  email: { type: String, unique: true },
  password: String,
  favorites:Array
});

userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest('hex');
};

var User = mongoose.model('User', userSchema)

module.exports = User;


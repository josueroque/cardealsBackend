'use strict';

const mongoose = require('mongoose');
var hash = require('hash.js');


const userSchema = mongoose.Schema({
  name:String,
  surname:String,
  email: { type: String, unique: true },
  password: String,
});

userSchema.statics.hashPassword = function (plain) {
  return hash.sha256().update(plain).digest('hex');
};

var User = mongoose.model('User', userSchema)

module.exports = User;


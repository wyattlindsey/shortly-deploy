'use strict';

const db = require('../config');
const bcrypt = require('bcrypt-nodejs');
const Promise = require('bluebird');
const mongoose = require('mongoose');

const userSchema = mongoose.Schema ({
  username: {type: String, required: true, index: { unique: true} },
  password: {type: String, required: true}
});

const User = mongoose.model('User', userSchema);

userSchema.pre('save', function(next) {
  let cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
      next();
    });
});

User.comparePassword = function(attemptedPassword, userPassword, callback) {
  bcrypt.compare(attemptedPassword, userPassword, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};


module.exports = User;

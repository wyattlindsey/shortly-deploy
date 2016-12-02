"use strict";

const db = require('../config');
const crypto = require('crypto');
const mongoose = require('mongoose');

const linkSchema = mongoose.Schema({
  url: String,
  baseUrl: String,
  code: String,
  title: String,
  visits: {type: Number, default: 0}
});

const Link = mongoose.model('Link', linkSchema);

linkSchema.pre('save', function(next) {
  const shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code = shasum.digest('hex').slice(0, 5);
  next();
});


module.exports = Link;

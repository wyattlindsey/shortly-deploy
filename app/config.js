var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/shortlydb');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'DATABASE ERROR: '));
db.once('open', function() {
  console.log('STARTED DATABASE');
});

module.exports = db;

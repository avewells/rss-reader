var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up new schema object for a feed
var Feed = new Schema({
    _username: String,
    url: String
});

module.exports = mongoose.model('Feed', Feed);
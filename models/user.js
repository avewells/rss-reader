var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

// set up the schema object for a user
var User = new Schema({
    username: String,
    password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);
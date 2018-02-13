var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Feed = require('../models/feed');
var router = express.Router();

// GET all feeds for logged in user
// localhost/feed/
router.get('/', function(req, res) {
    // a user is logged in
    if (req.user) {
        Feed.find({ _username: req.user.username }, function(err, feeds) {
            if (err) {
                res.render('error', { error: err.message });
            } else {
                res.render('feed', { feeds: feeds });
            }
        });
    } else {
        // not logged in, not allowed here
        res.status(401).send('Unauthorized.');
    }
});

// POST a new feed
// localhost/feed/create
router.post('/create', function(req, res) {
    var feedUrl = req.body.url;
    // a user is logged in
    if (req.user) {
        Feed.create({ _username: req.user.username, url: feedUrl }, function(err, feed) {
            if (err) {
                res.render('error', { error: err.message });
            } else {
                res.redirect('/feed');
            }
        });
    } else {
        // not allowed
        res.status(401).send('Unauthorized.');
    }
});

// DELETE an existing feed
// localhost/feed/remove/q3lqiu3bt1
router.post('/remove/:id', function(req, res) {
    var id = req.params.id;
    // a user is logged in
    if (req.user) {
        // additional check so someone that is logged in can't delete someone else's feeds
        Feed.find({_id: id}, function(err, feed) {
            if (feed[0]._username != req.user.username) {
                res.status(401).send('Unauthorized.');
            } else {
                Feed.findByIdAndRemove(id, function(err, feed) {
                    if (err) {
                        res.render('error', { error: err.message });
                    } else {
                        res.redirect('/feed');
                    }
                });
            }
        });
    } else {
        // not allowed
        res.status(401).send('Unauthorized.');
    }
});


module.exports = router;

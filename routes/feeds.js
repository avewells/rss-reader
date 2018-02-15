var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Feed = require('../models/feed');
var auth = require('./auth');
var router = express.Router();

// GET all feeds for logged in user
// localhost/feed/
router.get('/', auth.isAuth, function(req, res) {
    Feed.find({ _username: req.user.username }, function(err, feeds) {
        if (err) {
            res.render('error', { error: err.message });
        } else {
            res.render('feed', { feeds: feeds });
        }
    });
});

// POST a new feed
// localhost/feed/create
router.post('/create', auth.isAuth, function(req, res) {
    var feedUrl = req.body.url;
    Feed.create({ _username: req.user.username, url: feedUrl }, function(err, feed) {
        if (err) {
            res.render('error', { error: err.message });
        } else {
            res.redirect('/feed');
        }
    });
});

// DELETE an existing feed
// localhost/feed/remove/q3lqiu3bt1
router.post('/remove/:id', function(req, res) {
    var id = req.params.id;
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
});


module.exports = router;

var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var Feed = require('../models/feed');
var Parser = require('rss-parser');
var async = require('async');
var parser = new Parser({
  customFields: {
    item: ['media:thumbnail', 'media:content', 'enclosure']
  }
});
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // user is logged in so go ahead and grab posts
  if (req.user) {
    Feed.find({ _username: req.user.username }, function(err, feeds) {
      if (err) {
        res.render('error', { error: err.message });
      } else {
        // iterate over all user's feeds and attempt to parse them
        var combinedPosts = [];
        async.forEach(feeds, function(feed, callback) {
          parser.parseURL(feed.url, function(err, posts) {
            if (!err) {
              for (item in posts.items) {
                // create a new image key within object to store url for feed if it's there
                // according to docs, the images should be in <enclosure> but several don't do this
                posts.items[item].img = '';
                if (posts.items[item]['media:thumbnail']) {
                  posts.items[item].img = posts.items[item]['media:thumbnail']['$'].url;
                } else if (posts.items[item]['media:content']) {
                  posts.items[item].img = posts.items[item]['media:content']['$'].url;
                } else if (posts.items[item].enclosure) {
                  posts.items[item].img = posts.items[item].enclosure.url;
                }
                combinedPosts.push(posts.items[item]);
              }
            }
            // let async know we are done with this part
            callback();
          });
        }, function(err) {
          // calculate dashboard statistics to pass to frontend as well
          var articleCount = combinedPosts.length;
          
          // new users will not have any so break here
          if (articleCount == 0) {
            res.render('index', { newUser: true, user: req.user });
          } else {
            res.render('index', { user: req.user, posts: combinedPosts });
          }
        });
      }
    });
  } else {
    res.render('login');
  }
});

// GET: /register
router.get('/register', function(req, res) {
  res.render('register');
});

// POST: /register
router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', { error: err.message });
    }
    passport.authenticate('local')(req, res, function() {
      res.redirect('/');
    });
  });
});

// GET /login
router.get('/login', function(req, res) {
  res.render('login', { user: req.user, error: req.flash('error') });
});

// POST /login
router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login', failureFlash: true }));

// GET /logout
router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});


module.exports = router;

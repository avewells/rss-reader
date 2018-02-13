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

// padding function
String.prototype.lpad = function(padString, length) {
  var str = this;
  while (str.length < length)
      str = padString + str;
  return str;
}

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
                // make the date the proper format
                var date = new Date(posts.items[item].pubDate);
                posts.items[item].prettyDate = (date.getMonth() + 1).toString().lpad('0', 2) + '/' + 
                                                date.getDate().toString().lpad('0', 2) + '/' + date.getFullYear() + ' ' + 
                                                date.getHours().toString().lpad('0', 2) + ':' + date.getMinutes().toString().lpad('0', 2);
                combinedPosts.push(posts.items[item]);
              }
            }
            // let async know we are done with this part
            callback();
          });
        }, function(err) {
          //console.log(combinedPosts);
          // calculate dashboard statistics to pass to frontend as well
          var articleCount = combinedPosts.length;
          
          // new users will not have any so break here
          if (articleCount == 0) {
            res.render('index', { newUser: true, user: req.user });
          } else {
            var imgCount = 0;
            for (post in combinedPosts) {
              if (combinedPosts[post].img != '') {
                imgCount++;
              }
            }
            // initially sort all posts in chronological order
            // can use this for dashboard as well
            combinedPosts.sort(function(post1, post2) {
              return Date.parse(post2.pubDate) - Date.parse(post1.pubDate);
            });
            var newestPost = combinedPosts[0].prettyDate;
            var oldestPost = combinedPosts[combinedPosts.length - 1].prettyDate;
            var dashboard = {articleCount: articleCount, imgCount: imgCount, newestPost: newestPost, oldestPost: oldestPost};
            
            // check if user wanted articles sorted by title or description instead of default date
            if (req.query.sort == 'title') {
              combinedPosts.sort(function(post1, post2) {
                return post1.title.localeCompare(post2.title);
              });
            } else if (req.query.sort == 'desc') {
              combinedPosts.sort(function(post1, post2) {
                return post1.contentSnippet.localeCompare(post2.contentSnippet);
              });
            } 
            res.render('index', { user: req.user, posts: combinedPosts, dash: dashboard });
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

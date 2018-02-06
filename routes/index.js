var express = require('express');
var passport = require('passport');
var User = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { user : req.user });
});

router.get('/register', function(req, res) {
  res.render('register', {});
});

router.post('/register', function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) {
      return res.render('register', {error : err.message});
    }
    passport.authenticate('local')(req, res, function() {
      req.session.save(function(err) {
        if (err) {
          return next(err);
        }
      });
      res.redirect('/');
    });
  });
});

router.get('/login', function(req, res) {
  res.render('login', {user : req.user, error : req.flash('error')});
});

router.post('/login', passport.authenticate('local', {failureRedirect: '/login', failureFlash: true}), function(req, res, next) {
  req.session.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

router.get('/test', function(req, res) {
  res.status(200).send('success');
});

module.exports = router;

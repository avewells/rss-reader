/*
    Makes checking that a user is logged in slightly more robust (and causes less clutter)
*/

var express = require('express');
var passport = require('passport');

exports.isAuth = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
};
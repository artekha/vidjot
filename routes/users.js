const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

// Load user model
require('../models/User');

const User = mongoose.model('users');

// User login route
router.get('/login', (req, res) => {
  res.render('users/login');
});

// User register route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

// Register form POST
router.post('/register', (req, res) => {
  const creds = req.body;
  let errors = [];

  const pushToErrors = msg => {
    errors.push({message: msg});
  }

  if (creds.password !== creds.confirmPassword) {
    pushToErrors('Passwords should match');
  }

  if (creds.password.length < 4) {
    pushToErrors('Password to short');
  }

  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: creds.name,
      email: creds.email,
      password: creds.password,
      confirmPassword: creds.confirmPassword,
    });
  } else {
    User.findOne({
      email: creds.email
    })
    .then(user => {
      if (user) {
        req.flash('errorMsg', 'Email already registred.');
        res.redirect('/users/register');
      } else {
        const newUser = new User({
          name: creds.name,
          email: creds.email,
          password: creds.password,
        });
        
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save()
              .then(user => {
                req.flash('successMsg', 'You\'re now register and can login');
                res.redirect('/users/login')
              })
              .catch(err => {
                console.log(err);
                return;
              });
          });
        });
      }
    });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('successMsg', 'You are logged out');
  res.redirect('/users/login');
});

module.exports = router;
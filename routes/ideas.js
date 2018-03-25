const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { ensureAuthenticated } = require('../helpers/auth');

// Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
  Idea.find({userId: req.user.id})
    .sort({date: 'desc'})
    .then(ideas => {
      res.render('ideas/index', {
        ideas: ideas
      });
    });
});

// Add idea form
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('ideas/add');
});

// Add idea form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id;
  Idea.findOne({
    _id: id
  })
  .then(idea => {

    if (idea.userId != req.user.id) {
      req.flash('errorMsg', 'Not authorized');
      res.redirect('/ideas');
    } else {
      res.render('ideas/edit', {
        idea: idea
      });
    }
  });
});

// Process form
router.post('/', ensureAuthenticated, (req, res) => {
  let errors = [];

  if (!req.body.title) {
    errors.push({
      message: 'Please add a title'
    });
  }
  if (!req.body.details) {
    errors.push({
      message: 'Please add some details'
    });
  }

  if (errors.length > 0) {
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {
      title: req.body.title,
      details: req.body.details,
      userId: req.user.id
    };
    new Idea(newUser)
      .save()
      .then(idea => {
        req.flash('successMsg', 'Video idea added');
        res.redirect('/ideas')
      })
  }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    idea.title = req.body.title;
    idea.details = req.body.details;
    idea.save()
      .then(idea => {
        req.flash('successMsg', 'Video idea changed');
        res.redirect('/ideas');
      });
  });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
  Idea.remove({
    _id: req.params.id
  })
  .then(() => {
    req.flash('successMsg', 'Video idea removed');
    res.redirect('/ideas');
  });
});

module.exports = router;
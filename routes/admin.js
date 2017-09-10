'use strict'
const express = require('express');
const router  = express.Router();
const auth    = require('../scripts/auth.js')
const session = require('express-session')

const User = require('../models/user.js')

/* GET users listing. */
router.get('/',auth.admin, function(req, res, next) {
  console.log(req.session.user)
  res.render('admin',{title:'Luovat.com | Dashboard', userName: req.session.user == undefined ? 'User ERROR!' : req.session.user.firstName})
});

module.exports = router;
'use strict'
const express = require('express');
const router  = express.Router();
const auth    = require('../scripts/auth.js')

const User = require('../models/user.js')

/* GET users listing. */
router.get('/',auth.admin, function(req, res, next) {
  res.render('admin',{title:'Admin'})
});

module.exports = router;
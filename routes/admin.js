'use strict'
const express = require('express');
const router = express.Router();

const User = require('../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('admin',{title:'Admin'})
});

module.exports = router;
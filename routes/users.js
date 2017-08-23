var express = require('express');
var router = express.Router();

const User = require('../models/user.js')

/* GET users listing. */
router.get('/', function(req, res, next) {
  User
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/new',function(req,res,next){
  console.log('BODY',req.body)
  User 
    .query()
    .insert({firstName:req.body.firstName,lastName:req.body.lastName})
    .then((newUser) => {
      console.log(newUser)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = router;

'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const helper    = require('../scripts/helper.js');
const session = require('express-session');

const Order       = require('../models/order.js');
const Order_User  = require('../models/order_user.js');
const User = require('../models/user.js');

router.post('/login',(req,res,next) => {
    User
    .query()
    .where('email','=',req.body.email)
    .first()
    .then((user) => {
        console.log('Mobile user:',user)
        if(user && bcrypt.compareSync(req.body.password, user.password)){
            return User
            .query()
            .patchAndFetchById(user.id,{accessToken:uniqid()})
        }else{
            let err = new Error('Forbidden');
            err.status = 403;
            return err
        }
    })
    .then(cbUser => {
        console.log('Mobile cbUser:',cbUser)
        if(!cbUser.accessToken){
            res.status(403)
        }else{
            res.send(cbUser.accessToken)
        }
    })
    .catch(err => {
      console.log('LOGIN ERR:',err)
      res.sendStatus(500)
    })
})

module.exports = router;
'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const bcrypt  = require('bcrypt-nodejs');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const helper    = require('../scripts/helper.js');
const session = require('express-session');

const Order       = require('../models/order.js');
const Order_User  = require('../models/order_user.js');
const User = require('../models/user.js');

router.post('/login',(req,res,next) => {
    let user;
    User
    .query()
    .findOne('email',req.body.email.toLowerCase())
    .then(user => {
        console.log('Mobile user:',user)
        console.log('USER: ',user,' BCRYPT: ', bcrypt.compareSync(req.body.password, user.password))
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
            res.send({id:cbUser.id,name:cbUser.firstName,accessToken:cbUser.accessToken})
        }
    })
    .catch(err => {
      console.log('LOGIN ERR:',err)
      res.sendStatus(500)
    })
})

router.get('/pickups',auth.mobileArtist, function(req, res, next) {
    var userOrders = [];
    Order_User
      .query()
      .where('userId',req.body.user.id)
      .then(relations => {
        _.forEach(relations, (relation) => {
          console.log(relation.orderId)
          userOrders.push(relation.orderId)
        })
      })
      .then((relations)=>{
        //VANHA ORDERS
        Order
        .query()
        .where('pending',false)
        .andWhere('artistSelection',null)
        .then((orders) => {
          //FILTER DATA NOT TO BE SENT TO USER
          var data = {users:[],open:[]};
          _.forEach(orders,function(order){
            if(userOrders.indexOf(order.id) != -1){
              data.users.push({
                id:order.id,
                message:order.clientMessage,
                date:order.eventDate,
                city:order.eventCity, 
                size:order.eventSize
              })
            }else{
              data.open.push({
                id:order.id,
                message:order.clientMessage,
                date:order.eventDate,
                city:order.eventCity, 
                size:order.eventSize
              })
            }
          })
          res.send(data)
        })
        .catch(err => {
          console.log(err)
          res.sendSatus(500)
        })
        //VANHA ORDERS
      })
});

module.exports = router;
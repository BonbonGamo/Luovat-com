'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const session = require('express-session');

const Order = require('../models/order.js')

//SEND ORDER LISTING TO ADMIN PAGE
router.get('/',auth.admin, function(req, res, next) {
    Order
      .query()
      .then((orders) => {
        res.send(orders)
      })
      .catch(err => {
        console.log(err)
        res.sendSatus(500)
      })
});

//SEND ORDER LISTING TO USER PAGE
router.get('/pickups',auth.artist, function(req, res, next) {
    Order
      .query()
      .where('pending',false)
      .then((orders) => {
        //FILTER DATA NOT TO BE SENT TO USER
        var data = [];
        console.log('ORDERS: ', orders)
          _.forEach(orders,function(order){
            data.push({
              id:order.id,
              message:order.clientMessage,
              date:order.eventDate,
              city:order.eventCity, 
              size:order.eventSize
            })
          })
          res.send(data)
        })
      .catch(err => {
        console.log(err)
        res.sendSatus(500)
      })
});

router.get('/get-orders-by-artist',auth.artist, function(req,res,next){
  Order
      .query()
      .where('artistSelection',parseInt(req.session.user.id))
      .andWhere('deleted',null)
      .then((orders) => {
        console.log('ORDERS 57: ', orders)
        res.send(orders)
      })
      .catch(err => {
        console.log(err)
        res.sendSatus(500)
      })
})

router.post('/artist-edit-order',auth.artist,function(req,res,next){
  var add1 = (req.body.add1 == 'true')
  var add2 = (req.body.add2 == 'true')
  var add3 = (req.body.add3 == 'true')
  
  Order
    .query()
    .patch({
      artistStatus:req.body.artistStatus,
      extraHours:req.body.extraHours,
      additional1:add1,
      additional2:add2,
      additional3:add3
    })
    .where('id',req.body.id)
    .andWhere('artistSelection',parseInt(req.session.user.id))
    .then((newUser) => {
      console.log(newUser)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

//USER PICKS UP A ORDER
router.post('/pickup',auth.artist,function(req,res,next){
  Order
    .query()
    .where('id',req.body.orderId)
    .first()
    .then(order => {
      return order.$relatedQuery('users').relate(req.session.user.id);
    })
    .then(() => {
      console.log('Pickup Done')
      res.sendStatus(200)
    });
})

router.get('/artist-options/:id/:token',function(req,res,next){
    Order
    .query()
    .findById(req.params.id)
    .then(function(order){
      if(order.clientToken != req.params.token){
          res.sendStatus(403)
      }
      else{
          order.$relatedQuery('users').then(function(users){
          let data = [];
          _.forEach(users,function(user){
            data.push({
              name:user.firstName + ' ' + user.lastName[0],
              reelLink:user.reelLink || 'No reel',
              link:'/orders/select-artist/' + user.id + '/' + req.params.token + '/' + req.params.id
            })
          })
          res.render('options',{
            title:'Luovat.com | Valitse kuvaaja',
            data:data
          })
        })
      }
    })
})

router.get('/select-artist/:userId/:token/:orderId',function(req,res,next){
  console.log(req.params.userId)
  Order
    .query()
    .patch({
      artistSelection:parseInt(req.params.userId)
    })
    .where('id',req.params.orderId)
    .andWhere('clientToken',req.params.token)
    .then((updated) => {
      console.log(updated)
      res.redirect('/')
    })
    .catch(err => {
      console.log(err)
      res.send(500)
    })
})

router.post('/new',function(req,res,next){
  var add1 = (req.body.add1 == 'true')
  var add2 = (req.body.add2 == 'true')
  var add3 = (req.body.add3 == 'true')
  
  Order
    .query()
    .insert({
      clientName:req.body.name,
      clientToken:uniqid(),
      clientCompany:req.body.company || 'Yritystä ei annettu',
      clientEmail:req.body.email,
      clientMessage:req.body.message,
      clientPhone:req.body.phone || 'Puhelinnumeroa ei annettu',
      eventDate:req.body.date || 'Päivämäärää ei määrätty',
      eventCity:req.body.city || 'Kaupunkia ei valittu',
      eventSize:req.body.size,
      additional1:add1,
      additional2:add2,
      additional3:add3,
      pending:true,
      invoice20:false,
      invoice100:false,
      closed:false,
    })
    .then((newUser) => {
      console.log(newUser)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/free-pending/:id',auth.admin,function(req,res,next){
    Order
    .query()
    .patch({
      pending:false
    })
    .where('id',req.params.id)
    .then( updated => {
      console.log('Order freed to pickups:', updated.clientName)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/invoice20/:id',auth.admin,function(req,res,next){
    Order
    .query()
    .patch({
      invoice20:true,
      invoice20MadeBy:req.session.user.firstName + ' ' + req.session.user.lastName
    })
    .where('id',req.params.id)
    .then( updated => {
      console.log('Invoice 20% made by:', updated.invoice20MadeBy,'. For client: ',updated.clientName)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/invoice100/:id',auth.admin,function(req,res,next){
    Order
    .query()
    .patch({
      invoice100:true,
      invoice100MadeBy:req.session.user.firstName + ' ' + req.session.user.lastName
    })
    .where('id',req.params.id)
    .then( updated => {
      console.log('Invoice 100% made by:', updated.invoice100MadeBy,'. For client: ',updated.clientName)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/delete/:id',function(req,res,next){
  Order
    .query()
    .patch(
      {deleted:true}
    )
    .where('id',req.params.id)
    .then(deleted => {
      console.log('User deleted');
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err);
      res.sendSatus(500)
    });
})
module.exports = router;
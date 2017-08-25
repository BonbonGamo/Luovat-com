'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const bcrypt  = require('bcrypt-nodejs');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const session = require('express-session');

const User = require('../models/user.js')

router.get('/', function(req, res, next) {
  res.render('artist',{})
});

router.get('/all',auth.admin ,function(req, res, next) {
  User
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch(err => {
      console.log(err)
    })
});

router.get('/logout', function(req,res,next){
  req.session.destroy();
  res.sendStatus(200);
})

router.get('/inject-super-user',function(req,res,next){
  User 
    .query()
    .insert({
      firstName:'Petteri',
      lastName:'Ponkamo',
      passwordChangeToken:'petteri-on-mestari'
    })
    .then((newUser) => {
      console.log(newUser)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/new',function(req,res,next){
  User 
    .query()
    .insert({
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      passwordChangeToken:uniqid()
    })
    .then((newUser) => {
      console.log(newUser)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/:id', function(req, res, next) {
  User
    .query()
    .where('id','=',req.params.id)
    .then((users) => {
      res.send(users)
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/delete/:id',function(req,res,next){
  User
    .query()
    .patch(
      {deleted:true}
    )
    .where('id','=',req.params.id)
    .then(deleted => {
      console.log('User deleted');
    })
    .catch(err => {
      console.log(err);
    });
})

router.post('/edit', function(req,res,next){
  let o = req.body;
  console.log('Editing user with data: ',o)
  User
    .query()
    .patch({
      firstName:    o.firstName,
      lastName:     o.lastName,
      email:        o.email,
      phone:        o.phone,
      street:       o.street,
      city:         o.city,
      zipCode:      o.zipCode,
      payment:      o.payment,
      reelLink:     o.reelLink,
      reelPassword: o.reelPassword,
      employee:     o.employee
    })
    .where('id','=',o.id)
    .then( updated => {
      console.log('User updated')
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/login', function(req,res,next){
  User
    .query()
    .where('email','=',req.body.email)
    .then(function(user){
      var target;
      console.log('USER: ',user)
      if(bcrypt.compareSync(req.body.password, user[0].password)){
        req.session.user = user[0];
        if(user[0].email == 'petteri@huddle.fi'){
          target = 'admin'
        }else{target = 'artist'}
      }
      if(target == 'artist'){
        res.render('artist',user)
      }else if(target == 'admin'){
        res.redirect('/admin')
      }else{
        res.sendStatus(403)
      }
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})



router.get('/change-password/:token',function(req,res,next){
  User
    .query()
    .where('passwordChangeToken','=',req.params.token)
    .then(function(user){
      res.render('changePass',{
        title:'Vaihda salasana',
        token:req.params.token
      })
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(404)
    })
})

router.post('/change-password',function(req,res,next){
  console.log(req.body)
  User
    .query()
    .patch(
      {password:bcrypt.hashSync(req.body.password)}
    )
    .where('passwordChangeToken','=',req.body.token)
    .then(changed => res.sendStatus(200))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

module.exports = router;

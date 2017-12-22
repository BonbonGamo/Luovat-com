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
const Order = require('../models/order.js')

router.get('/',auth.artist, (req, res, next) => {
  res.render('artist',{title:'Luovat.com',user:{id:req.session.user.id,name:req.session.user.firstName}})
});

router.get('/artist-balance',(req,res,next) => {
  console.log('BALANCE',req.session.user.id)
  Order
  .query()
  .where('artistSelection',parseInt(req.session.user.id))
  .andWhere('invoice100',false)
  .andWhere('closed',false)
  .then(cbOrders => {
    console.log(cbOrders)
    let sum = 0;
    _.forEach(cbOrders,(order)=>{
      sum = sum + (order.total / 100) * 70;
    })
    console.log('SUM:',sum)
    res.send({sum:sum})
  })
  .catch(err => {
    console.log('Err: ',err)
    res.sendStatus(500)
  })
})

router.get('/rekry',auth.admin, (req,res,next) => {
  User
  .query()
  .where('activeUser',false)
  .then(users => {
    console.log(users)
    res.send(users)
  })
  .catch(err => {
    console.log(err)
    res.send(500)
  })
})

router.get('/all',auth.admin ,(req, res, next) => {
  User
    .query()
    .then((users) => {
      res.send(users)
    })
    .catch(err => {
      console.log(err)
    })
});

router.get('/logout', (req,res,next) => {
  req.session.destroy();
  res.redirect('/');
})

router.get('/inject-super-user',(req,res,next) => {
  User 
    .query()
    .insert({
      activeUser:true,
      firstName:'Petteri',
      lastName:'Ponkamo',
      email:'petteri@huddle.fi',
      passwordChangeToken:'petteri-on-mestari'
    })
    .then((newUser) => {
      console.log(newUser)
      res.redirect('/artists/change-password/petteri-on-mestari')
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/new',(req,res,next) => {
  if(!req.body.firstName || !req.body.lastName || req.body.rekryMessage){
    throw new Error(500,'Missing fields')
  }
  User 
    .query()
    .insert({
      activeUser:false,
      firstName:req.body.firstName,
      lastName:req.body.lastName,
      phone:req.body.phone ? req.body.phone : '',
      email:req.body.email ? req.body.email : '',
      rekryMessage:req.body.rekryMessage ? req.body.rekryMessage : '',
      passwordChangeToken:uniqid()
    })
    .then(newUser => {
      emailer.rekryReply(newUser)
    })
    .then(postmarkResponse => {
      console.log(postmarkResponse)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.send(500,err)
    })
})

router.post('/activate-user/:id', auth.admin ,(req,res,next) => {
  User
  .query()
  .patchAndFetchById(req.params.id,{activeUser:true})
  .then((cbUser) => {
    //TODO: Lähetä käyttäjälle salasanalinkki
    return emailer.changePassword(cbUser.email,cbUser)
  })
  .then(postmarkResponse => {
    console.log(postmarkResponse)
    res.sendStatus(200)
  })
  .catch(err => {
    res.sendStatus(500)
  })
})

router.get('/data', (req, res, next) => {
  console.log('ID',req.session.user.id)
  User
    .query()
    .where('id',parseInt(req.session.user.id))
    .first()
    .then((user) => {
      res.send(_.pick(user,['id','firstName','lastName','email','phone','street','city','zipCode','payment']))
    })
    .catch(err => {
      console.log(err)
    })
});

router.get('/:id',auth.admin, (req, res, next) => {
  User
    .query()
    .where('id','=',req.params.id)
    .then((user) => {
      res.send(users)
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/delete/:id',(req,res,next) => {
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

router.post('/edit', auth.admin,(req,res,next) =>{
  let o = req.body;
  console.log('Editing user with data: ',o)
  User
    .query()
    .patch({
      activeUser:   o.activeUser,// ? o.activeUser : false,
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
      employee:     o.employee,
      userLevel:    o.userLevel
    })
    .findById(o.id)
    .then( updated => {
      console.log('User updated',updated)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/artist-self-edit', auth.admin,(req,res,next) => {
  let editedDataInputs = ['firstName','lastName','email','phone','street','city','zipCode','payment'];
  console.log('INPUTS',editedDataInputs)
  _.forEach(editedDataInputs, (input,key) => {
    if(req.body[input] && req.body[input].length > 0){
      return;
    }
    editedDataInputs.splice(key,1);
    return;
  })
  console.log('FILTERED',editedDataInputs)
  let editedData = _.pick(req.body, editedDataInputs)
  console.log('Editing user with data: ',editedData)
  User
    .query()
    .patch(editedData)
    .findById(req.body.id)
    .then( updated => {
      console.log('User updated')
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

router.post('/login', (req,res,next) => {
  User
    .query()
    .where('email','=',req.body.email)
    .then((user) => {
      var target;
      console.log('USER',user)
      if(user[0] && bcrypt.compareSync(req.body.password, user[0].password)){
        req.session.user = user[0];
        if(user[0].email == 'petteri@huddle.fi'){
          target = 'admin'
        }
        else{
          target = 'artist'
        }
      }
      if(target == 'artist'){
        res.redirect('/artists')
      }else if(target == 'admin'){
        res.redirect('/admin')
      }else if(user == []){
        res.render('login',{title:'Login failed'})
      }else{
        res.render('login',{title:'Login failed'})
      }
    })
    .catch(err => {
      console.log('LOGIN ERR:',err)
      res.sendStatus(500)
    })
})

router.get('/send-password-change-link/:id', auth.admin, (req,res,next) => {
  User
  .query()
  .patchAndFetchById(req.params.id,{passwordChangeToken:uniqid()})
  .then(cbUser => {
    console.log('Send password change to: ',cbUser.fisrName)
    return emailer.changePassword(cbUser.email,cbUser)
  })
  .then(postmarkResponse => {
    console.log(postmarkResponse)
    res.send(200);
  })
  .catch(err => {
    console.log(err);
    res.send(500);
  })
})

router.get('/change-password/:token', (req,res,next) => {
  User
    .query()
    .where('passwordChangeToken','=',req.params.token)
    .then((user) => {
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

router.post('/change-password',(req,res,next) => {
  User
    .query()
    .patch(
      {password:bcrypt.hashSync(req.body.password),passwordChangeToken:uniqid()}
    )
    .where('passwordChangeToken','=',req.body.token)
    .then(changed => res.sendStatus(200))
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

module.exports = router;

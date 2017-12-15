'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const helper  = require('../scripts/helper.js');
const session = require('express-session');
const moment  = require('moment')

const User        = require('../models/user.js')
const Order       = require('../models/order.js')
const Order_User  = require('../models/order_user.js')

//SEND ORDER LISTING TO ADMIN PAGE
router.get('/',auth.admin, function(req, res, next) {

  Order
    .query()
    .eager('users')
    .then((orders) => {
      res.send(orders)
    })
    .catch(err => {
      console.log(err)
      res.status(500)
    })
});

router.get('/get-eager-by-id/:id',(req,res,next) => {
  console.log('Get eager'+req.params.id)

  Order
  .query()
  .where('id',req.params.id)
  .first()
  .then(order => {
    return order.$relatedQuery('users')  
  })
  .then(cbUsers => {
    let users = [];
    _.forEach(cbUsers, user => {
      users.push(_.pick(user,['id','firstName','lastName']))
    })
    console.log(users)
    res.send(users)
  })
  .catch(err => {
    console.log(err)
    res.status(500)
  })
})

router.put('/remove-pickup/:id',auth.artist,(req,res,next) => {
  let userId = req.session.user.id;
  let orderId = req.params.id;

  Order_User
  .query()
  .patch({
    orderId:null,
    userId:null
  })
  .where('userId',userId)
  .andWhere('orderId',orderId)
  .first()
  .then((cbOrderUser) => {
    res.send(200)
  })
  .catch(err => {
    console.log(err)
    res.send(500)
  })
})

router.put('/admin-remove-pickup/:userId/:orderId',auth.admin,(req,res,next) => {
  let userId = req.params.userId;
  let orderId = req.params.orderId;

  Order_User
  .query()
  .patch({orderId:null,userId:null})
  .where('userId',userId)
  .andWhere('orderId',orderId)
  .first()
  .then((cbOrderUser)=>{
    res.send(200)
  })
  .catch(err => {
    console.log(err)
    res.send(500)
  })
})


//SEND FREED ORDERS TO ARTIST PAGE
router.get('/pickups',auth.artist, function(req, res, next) {
    var userOrders = [];
    Order_User
      .query()
      .where('userId',req.session.user.id)
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

router.get('/get-orders-by-artist',auth.artist, function(req,res,next){
  Order
      .query()
      .where('artistSelection',parseInt(req.session.user.id))
      .andWhere('deleted',null)
      .then((orders) => {
        _.forEach(orders,function(order){
          order.artistCut = (order.total / 100) * 70;
        })
        res.send(orders)
      })
      .catch(err => {
        console.log(err)
        res.sendSatus(500)
      })
})

router.post('/admin-edit-order',auth.admin,function(req,res,next){
  var data = {
    clientName:       req.body.clientName,
    clientCompany:    req.body.clientCompany,
    clientEmail:      req.body.clientEmail,
    clientMessage:    req.body.clientMessage,
    clientPhone:      req.body.clientPhone,
    eventCity:        req.body.eventCity,
    eventDate:        req.body.eventDate,
    eventSize:        req.body.eventSize,
    eventDescription: req.body.eventDescription,
    extraHours:       parseInt(req.body.extraHours),
    additional1:      req.body.additional1 == 'true' ? true : false,
    additional2:      req.body.additional2 == 'true' ? true : false,
    additional3:      req.body.additional3 == 'true' ? true : false,
    discountPercent:  parseInt(req.body.discountPercent),
  }
  Order
    .query()
    .patchAndFetchById(req.body.id,data)
    .then(function(cbOrder){
      helper.updateOrderTotal(cbOrder.id)
    })
    .then(function(order){
      res.send(200)
    })
    .catch(function(err){
      console.log(err)
      res.send(400,err)
    })
})
router.post('/artist-edit-order',auth.artist, (req,res,next) => {
  console.log('EDIT:',req.body.id)
  Order
    .query()
    .patchAndFetchById(req.body.id,{
      extraHours:parseInt(req.body.extraHours),
      additional1:req.body.add1 == 'true' ? true : false,
      additional2:req.body.add2 == 'true' ? true : false,
      additional3:req.body.add3 == 'true' ? true : false
    })
    .where('id',req.body.id)
    .andWhere('artistSelection',parseInt(req.session.user.id))
    .then( (cbOrder) => {
      helper.updateOrderTotal(cbOrder.id)
    })
    .then( cbOrder => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

//USER PICKS UP A ORDER
router.post('/pickup',auth.artist,function(req,res,next){
  let id,eager,order;
  Order
    .query()
    .where('id',req.body.orderId)
    .first()
    .then(cbOrder => {
      return Order
      .query()
      .patchAndFetchById(cbOrder.id,{
        eager: cbOrder.eager == null ? 1 : cbOrder.eager + 1
      })
    })
    .then(cbOrder => {
      order = cbOrder;
      console.log('ORDER:',order)
      return cbOrder.$relatedQuery('users').relate(req.session.user.id);
    })
    .then(() => {
      if(order.eager >= 3){
        console.log('3 EAGER')
        return emailer.artistSelection([order])
      }else{
        console.log('NO EAGER')
        return emailer.artistSelection([])
      }
    })
    .then((postmarkResponse) => {
      console.log(postmarkResponse)
      res.sendStatus(200)
    })
    .catch(err => {
      res.sendStatus(500)
    })  
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
          order.$relatedQuery('users').then(users => {
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

router.get('/orders-progres',function(req,res,next){
  var user = req.session.user;
  var ordersIds = [];
  var orders = [];

  Order_User
  .query()
  .where('userId',user.id)
  .then(cbOrderIds => {
    _.forEach(cbOrderIds,orderId => {
      console.log(orderId)
      ordersIds.push(orderId.orderId)
    })
    return Order
    .query()
    .where('artistSelection',null)
  })
  .then(orders => {
    var data = []
    _.forEach(orders, order =>{
      if(ordersIds.indexOf(order.id) != -1){
        data.push({
          id:order.id,
          message:order.clientMessage,
          date:order.eventDate,
          city:order.eventCity, 
          size:order.eventSize
        })
      }
    })
    console.log('EAGER ORDERS FOR THIS USER:',data)
    res.send(data)
  })
  .catch(err => {
    console.log(err)
  })

})

router.get('/select-artist/:userId/:token/:orderId',(req,res,next) => {
  let order;
  Order
    .query()
    .patchAndFetch({
      artistSelection:parseInt(req.params.userId)
    })
    .where('id',req.params.orderId)
    .andWhere('clientToken',req.params.token)
    .then(cbOrder => {
      order = cbOrder;

      return User
      .query()
      .findById(req.params.userId)
    })
    .then(cbUser => {
      return emailer.artistSelected(cbUser,order)
    })
    .then(postmarkResponse => {
      console.log(postmarkResponse)
      res.redirect('/')
    })
    .catch(err => {
      console.log(err)
      res.send(500)
    })
})

router.post('/new',(req,res,next) => {
  let add1 = (req.body.add1 == 'true')
  let add2 = (req.body.add2 == 'true')
  let add3 = (req.body.add3 == 'true')

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
      total:0,
      revenue:0,
      eagerMax:3,
      ready:false,
      discountPercent:0,
      additional1:add1,
      additional2:add2,
      additional3:add3,
      pending:true,
      invoice20:false,
      invoice100:false,
      closed:false,
    })
    .then(newOrder => {
      return helper.updateOrderTotal(newOrder.id)
    })
    .then(cbOrderWithRevenue => {
      
      return emailer.orderConfirmation(cbOrderWithRevenue)
    })
    .then(postmarkResponse => {
      console.log(postmarkResponse)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err)
      res.sendStatus(500)
    })
})

router.post('/free-pending/:id',auth.admin,(req,res,next) => {
  let order;

  Order
  .query()
  .patchAndFetchById(req.params.id,{
    pending:false,
    pendingFreedAt:moment().format('LLLL')
  })
  .then( cbOrder => {
    order = cbOrder
    
    return User
    .query()
  })
  .then(cbUsers => {
    return emailer.newPickups(cbUsers,order)
  })
  .then(postmarkResponse => {
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(500)
  })
})

router.post('/invoice20/:id/:invoiceNumber',auth.admin,(req,res,next) => {
    if(!req.params.invoiceNumber) throw new err('No invoice number');
    Order
    .query()
    .patchAndFetchById(req.params.id,{
      invoice20Number:req.params.invoiceNumber,
      invoice20:true,
      invoice20MadeBy:req.session.user.firstName + ' ' + req.session.user.lastName
    })
    .then( (cbOrder) => {
      var total = (cbOrder.total / 100) * 20;
      helper.updateOrderRevenueByInvoiceTotal(cbOrder.id,total)
    })
    .then( cbOrder => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})



router.post('/invoice100/:id/:invoiceNumber',auth.admin,(req,res,next) => {
    if(!req.params.invoiceNumber) throw new err('No invoice number');
    //TODO: CHECK IF THE JOB IS DONE!!

    Order
    .query()
    .patchAndFetchById(req.params.id,{
      invoice100Number:req.params.invoiceNumber,
      invoice100:true,
      invoice100MadeBy:req.session.user.firstName + ' ' + req.session.user.lastName
    })
    .then(cbOrder => {
      var total = cbOrder.total - cbOrder.revenue;
      helper.updateOrderRevenueByInvoiceTotal(cbOrder.id,total)
    })
    .then( (cbOrder) => {
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/artist-order-ready/:id',auth.artist,(req,res,next) => {
    console.log('READY',req.params.id)
    Order
    .query()
    .patchAndFetchById(req.params.id,{
      ready:true
    })
    .then(cbOrder => {
      console.log('Order ready:',cbOrder)
      res.sendStatus(200)
    })
    .catch(err => {
      console.log(err.stack)
      res.sendStatus(500)
    })
})

router.post('/close-order/:id',auth.admin,(req,res,next) => {
    Order
    .query()
    .patchAndFetchById(req.params.id,{
      closed:true
    })
    .then(cbOrder => {
      console.log('Closed order: ',cbOrder)
    })
    .catch(err => {
      console.log(err)
    })
})

router.post('/delete/:id',(req,res,next) => {
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
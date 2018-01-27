'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const helper  = require('../scripts/helper.js');
const session = require('express-session');
const moment  = require('moment');

const User        = require('../models/user.js')
const Order       = require('../models/order.js')
const Order_User  = require('../models/order_user.js')
const Campaign    = require('../models/campaign.js')

router.get('/', auth.admin, (req,res,next) => {
    Campaign
    .query()
    .then(cbCampaigns => {
        console.log('CAMPAIGNS: ',cbCampaigns)
        res.send(cbCampaigns)
    })
    .catch(err => {
        if (err) { return next(err); }
    })
})

router.get('/delete/:id',auth.admin, (req,res,nexr) => {
    Campaign
    .query()
    .delete()
    .where('id',req.params.id)
    .then( deleted => {
        res.sendStatus(200)
    })
})

router.get('/check/:code',(req,res,next) => {
    Campaign
    .query()
    .where('campaignCode',req.params.code)
    .first()
    .then( cbCampaign => {
        if(!cbCampaign) throw new Error ('Not found')
        res.sendStatus(200)
    })
    .catch(err => {
        if (err) { return next(err); }
    })

})

router.post('/new', auth.admin, (req,res,next) => {
    Campaign
    .query()
    .insert({
        campaignName:req.body.campaignName,
        campaignCode:req.body.campaignCode,
        isActive:false,
        starts:req.body.starts,
        ends:req.body.ends,
        madeBy:req.session.user.firstName + ' ' + req.session.user.lastName,
        editedBy:req.session.user.firstName + ' ' + req.session.user.lastName,
        percent: parseInt(req.body.percent)
    })
    .then(cbCampaign => {
        console.log(cbCampaign)
        res.sendStatus(200)
    })
    .catch(err => {
        console.log(err)
        if (err) { return next(err); }
    })
})

router.post('/edit', auth.admin, (req,res,next) => {
    console.log(req.body,'USER: ', req.session.user.firstName + ' ' + req.session.user.lastName,)

    Campaign
    .query()
    .patchAndFetchById(parseInt(req.body.id),{
        campaignName:req.body.campaignName,
        campaignCode:req.body.campaignCode,
        starts:req.body.starts,
        ends:req.body.ends,
        editedBy:req.session.user.firstName + ' ' + req.session.user.lastName,
        percent: parseInt(req.body.percent)
    })
    .then(cbCampaign => {
        res.send(200)
    })
    .catch(err => {
        console.log(err)
        if (err) { return next(err); }
    })
})

router.post('/toggle-active/:id/:active', auth.admin, (req,res,next) => {
    let active = req.params.active == 'true' ? false : true;
    console.log(active)
    Campaign
    .query()
    .patchAndFetchById(req.params.id,{
        isActive:active
    })
    .then(cbCampaign => {
        console.log(cbCampaign)
        res.send(200)
    })
    .catch(err => {
        if (err) { return next(err); }
    })
})



module.exports = router;
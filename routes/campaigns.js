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
        res.sendStatus(500)
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
        res.sendStatus(500)
    })
})

router.post('/edit',auth.admin, (req,res,next) => {
    Campaign
    .query()
    .patchAndFetchById(req.body.id,{
        campaignName:req.body.campaignName,
        campaignCode:req.body.campaignCode,
        isActive:req.body.isActive,
        starts:req.body.starts,
        ends:req.body.ends,
        editedBy:req.sessions.user.firstName + ' ' +req.session.user.lastName,
        condition: req.body.condition || '',
        percent: req.body.percent
    })
    .then(cbCampaign => {
        res.send(200)
    })
    .catch(err => {
        res.send(500)
    })
})

module.exports = router;
'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const session = require('express-session');
const moment  = require('moment')
const constants = require('./constants.js')

const User        = require('../models/user.js')
const Order       = require('../models/order.js')
const Order_User  = require('../models/order_user.js')
const Campaign    = require('../models/campaign.js')

module.exports = {
    updateOrderTotal: function(id){
        console.log('Update order total')
        let order;
        return Order
        .query()
        .where('id',id)
        .first()
        .then(function(cbOrder){
            order = cbOrder
            if(!order.campaignCode) order.campaignCode = '';

            console.log('TILAUS: ',cbOrder)
            //LISÄÄ TILAUKSELLE KAMPANJAKOODI KENTTÄ
            return Campaign
            .query()
            .where('campaignCode',order.campaignCode)
            .first()
        })
        .then(cbCampaign => {
            let data = {};
            let discountFactor = 1;
            let sum = 0;
            let rows = {}

            data.discountPercent = order.discountPercent;

            if(cbCampaign){
                data.discountPercent = cbCampaign.percent;
            }

            discountFactor = (100 - data.discountPercent) / 100;

            //ADD ORDER ROWS 
            if(!order.eventSize) throw new err('Package not selected');
            if(order.eventSize == 's') rows.package = 79000;
            if(order.eventSize == 'm') rows.package = 99000;
            if(order.eventSize == 'l') rows.package = 139000;
            if(order.extraHours) rows.extraHours = order.extraHours * 5000;
            if(order.additional1) rows.add1 = 5000;
            if(order.additional2) rows.add2 = 10000;
            if(order.additional3) rows.add3 = order.voiceOverPrice ? order.voiceOverPrice : 10000;

            //SUM THE ORDER
            _.forEach(rows,function(row){
                sum = sum + row;
            })

            data = {
                price:sum,
                artistsCut:sum * 0.7,
                discountPercent:data.discountPercent,
                total:sum * discountFactor,
                revenue:(sum * discountFactor) - (sum * 0.7)
            }

            console.log('order:',data)

            return Order
            .query()
            .patchAndFetchById(order.id,data)
        })
        
    },
    updateOrderRevenueByInvoiceTotal: (id,total) => {
        return Order 
        .query()
        .where('id',id)
        .first()
        .then(function(cbOrder){
            var revenue = cbOrder.revenue || 0;
            revenue = revenue + total;
            console.log('REVENUE: ',revenue)
            return Order
            .query()
            .patchAndFetchById(cbOrder.id,{revenue:revenue})
        })
    },
    checkForOrdersToRelease: () => {
        let orders = {};
        let orderIds = [];
        let hasOneOrMore = [];
        let hasNone = [];
        let forRelease = [];
        let orderWaitLimit = moment().subtract(constants.orderWaitDays, 'days').format();

        Order
        .query()
        .where('artistSelection',null)
        .then(function(cbOrders){
            _.forEach(cbOrders,(order) => {
                orderIds.push(order.id)
                orders[JSON.stringify(order.id)] = order
            });
            return Order_User
            .query()
        })
        .then((cbOrder_Users) => {
            _.forEach(cbOrder_Users,(order_user) => {
                //CHECK IF ORDER HAS AT LEAST ONE ARTIST
                if(orderIds.indexOf(order_user.orderId) != -1){
                    hasOneOrMore.push(orders[order_user.orderId])
                }else{
                    hasNone.push(orders[order_user.orderId])
                }
            })
            _.forEach(hasOneOrMore, (order, key) => {
                if(order.pendingFreedAt != null && order.pendingFreedAt && moment(order.pendingFreedAt,'LLLL').isBefore(orderWaitLimit)){
                    forRelease.push(order)
                }
            })
            //TODO: SEND EMAIL TO CLIENT
            return emailer.artistSelection(forRelease)
        })
        .then(postmarkResponse => {
            console.log('POSTMARK: ',postmarkResponse)
        })
    },

    checkUpdate: () => {
        User
        .query()
        .then(users => {
            console.log(users[0])
            return Order
            .query()
        })
        .then(orders => {
            console.log(orders[0])

        })
    }
}
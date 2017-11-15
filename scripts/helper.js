'use strict'
const express = require('express');
const router  = express.Router();
const uniqid  = require('uniqid');
const emailer = require('../scripts/emailer.js');
const _       = require('lodash');
const auth    = require('../scripts/auth.js');
const session = require('express-session');

const Order       = require('../models/order.js')
const Order_User  = require('../models/order_user.js')

module.exports = {
    updateOrderTotal: function(id){
        console.log('Update order total')
        var orderId = id;
        return Order
        .query()
        .where('id',orderId)
        .first()
        .then(function(cbOrder){
            var sum = 0;
            var rows = {}
            if(!cbOrder.eventSize) throw new err('Package not selected');
            if(cbOrder.eventSize == 's') rows.package = 79000;
            if(cbOrder.eventSize == 'm') rows.package = 99000;
            if(cbOrder.eventSize == 'l') rows.package = 139000;
            if(cbOrder.extraHours) rows.extraHours = cbOrder.extraHours * 5000;
            if(cbOrder.additional1) rows.add1 = 5000;
            if(cbOrder.additional2) rows.add2 = 10000;
            if(cbOrder.additional3) rows.add3 = 10000;
            _.forEach(rows,function(row){
                sum = sum + row;
            })
            sum = sum * ((100 - cbOrder.discountPercent)/100);

            console.log(sum)

            return Order
            .query()
            .patchAndFetchById(cbOrder.id, {total:sum})
        })
        
    },
    updateOrderRevenueByInvoiceTotal: function(id,total){
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
    }
}
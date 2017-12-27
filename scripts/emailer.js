'use strict'
const constants = require('./constants.js');
const postmark  = require('postmark');
const _         = require('lodash');
const client    = new postmark.Client("b721277b-e84b-4e39-b407-8afc6d27821a");
const templates = {
    test:               4151001,
    changePass:         4150744,
    newPickups:         4157841,
    orderConfirmation:  4169302,
    artistSelection:    4170043,
    artistSelected:     4243101,
    rekryReply:         4219041,
    adminEventReady:    4272301,
};

let composeMail = (template,to,message) => {
    let envTo = to;
    if(constants.env == 'dev'){
        envTo = constants.admins[0]
    }
    return {
        TemplateId: templates[template],
        TemplateModel: message,
        InlineCss: true,
        From: "noreply@luovat.com",
        To: envTo,
        ReplyTo: "info@luovat.com",
        TrackOpens: true,
        TrackLinks: "None"
      }
}

module.exports = {
    changePassword:(to,user)=>{
        let mail = composeMail('changePass',to,{'passUrl':'www.luovat.com/artists/change-password/' + user.passwordChangeToken,'name':user.firstName + ' ' + user.lastName})
        return new Promise((resolve,reject) => {
            client.sendEmailWithTemplate(mail, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }
            })
        })
    },

    newPickups: (users,order) => {
        let mails = [];
        _.forEach(users, (user) => {
            mails.push(composeMail('newPickups',user.email,{
                'name'          :user.firstName, 
                'order_message' :order.clientMessage, 
                'order_city'    :order.eventCity || 'Ei määritetty',
                'order_date'    :order.eventDate || 'Ei määritetty' }))
        }) 
        return new Promise((resolve,reject) => {
            client.sendEmailBatch(mails, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }   
            })
        })
    },

    artistSelection: (orders) => {
        let mails = [];
        _.forEach(orders, (order) => {
            mails.push(composeMail('artistSelection',order.clientEmail,{
                "client_name"   : order.clientName,
                "selection_url" : 'www.luovat.com/orders/artist-options/'+ order.id + '/' + order.clientToken
            }))
        })
        return new Promise((resolve,reject) => {
            client.sendEmailBatch(mails, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }   
            })
        })
    },

    artistSelected: (user,order) => {
        let mail = composeMail('artistSelected',user.email,{
            "user_name": user.firstName + ' ' + user.lastName,
            "order_company"     : order.clientCompany,
            "order_clientName"  : order.clientName,
            "order_clientEmail" : order.clientEmail,
            "order_clientPhone" : order.clientPhone,
            "order_eventCity"   : order.eventCity,
            "order_eventDate"   : order.eventDate,
            "order_size"        : order.eventSize,
            "order_description" : order.clientMessage,
            "order_subs"        : order.additional1 ? 'Kyllä' : 'Ei' ,
            "order_air"         : order.additional2 ? 'Kyllä' : 'Ei',
            "order_voice"       : order.additional3 ? 'Kyllä' : 'Ei',
            "order_price"       : ((order.total)*0.7)/100.00,
        })
        return new Promise((resolve,reject) => {
            client.sendEmailWithTemplate(mail, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }
            })
        })
    },

    adminOrderReady: (user,order) => {
        let mails = [];
        _.forEach(constants.admins, admin => {
            mails.push(composeMail('adminEventReady',admin,{
                "user_name"         : user.firstName + ' ' + user.lastName,
                "order_company"     : order.clientCompany,
                "order_clientName"  : order.clientName,
                "order_clientEmail" : order.clientEmail,
                "order_clientPhone" : order.clientPhone,
                "order_eventCity"   : order.eventCity,
                "order_eventDate"   : order.eventDate,
                "order_size"        : order.eventSize,
                "order_description" : order.clientMessage,
                "order_subs"        : order.additional1 ? 'Kyllä' : 'Ei' ,
                "order_air"         : order.additional2 ? 'Kyllä' : 'Ei',
                "order_voice"       : order.additional3 ? 'Kyllä' : 'Ei',
                "order_price"       : ((order.total)*0.7)/100.00,
            }))
        })
        return new Promise((resolve,reject) => {
            client.sendEmailBatch(mails, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }   
            })
        })
    },

    orderConfirmation: (order) => {
        console.log(order)
        let mail = composeMail('orderConfirmation',order.clientEmail,{
                "order_company"     : order.clientCompany,
                "order_clientName"  : order.clientName,
                "order_clientEmail" : order.clientEmail,
                "order_clientPhone" : order.clientPhone,
                "order_eventCity"   : order.eventCity,
                "order_eventDate"   : order.eventDate,
                "order_size"        : order.eventSize,
                "order_description" : order.clientMessage,
                "order_subs"        : order.additional1 ? 'Kyllä' : 'Ei' ,
                "order_air"         : order.additional2 ? 'Kyllä' : 'Ei',
                "order_voice"       : order.additional3 ? 'Kyllä' : 'Ei',
                "order_price"       : (order.total)/100.00,
                "order_discount"    : order.discountPercent || 0,
                "order_vat"         : (order.total + order.total * 24 / 100)/100.00
        })
        return new Promise((resolve,reject) => {
            client.sendEmailWithTemplate(mail, (err,data) => {
                if(err){
                    reject(err.message)
                }else{
                    resolve(data)
                }
            })
        })
    },

    rekryReply: user => {
        let mail = composeMail('rekryReply',user.email,{user_name:user.firstName + ' ' + user.lastName})
        return new Promise((resolve,reject) => {
            client.sendEmailWithTemplate(mail, (err,data) => {
                if(err){
                    reject(err.message)
                } else {
                    resolve(data)
                }
            })
        })
    }
};

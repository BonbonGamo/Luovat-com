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
                "order_vat"         : (order.total + order.total * 24 / 100)/100.00
        })
        console.log(mail)
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

    testPostmark:() => {
        let mail = composeMail('test','petteri@huddle.fi',{'testVariable':'TESTI TOIMII','testVariable2':'TESTI TOIMII'})
        console.log('MAIL:',mail)
        console.log('POSTMARK TEST:')
        return new Promise((resolve,reject) => {
            client.sendEmailWithTemplate(mail, (err,data) => {
                if(err){
                    console.log('TEST ERR:',err)
                    reject(err.message)
                } else {
                    console.log('TEST', data)
                    resolve(data)
                }
            })
        })
    }
};

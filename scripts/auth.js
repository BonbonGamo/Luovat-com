'use strict'
const session = require('express-session');
const constants = require('./constants.js')
const User = require('../models/user.js')

module.exports = {
        admin:function(req,res,next){
            if(!req.session.user || constants.admins.indexOf(req.session.user.email) == -1 ){
                var err = new Error('Forbidden');
                err.status = 403;
                next(err);
            }else{
                next()
            }
        },
        artist:function(req,res,next){
            if(!req.session.user){
                console.log('Artist auth error')
                var err = new Error('Forbidden');
                err.status = 403;
                next(err);
            }else{
                next()
            }
        },
        mobileArtist:function(req,res,next){
            let user;
            User
            .query()
            .findById(req.body.id)
            .first()
            .then(cbUser => {
                user = cbUser;
            })
            if(!req.body.accessToken || req.body.accessToken != user.accessToken){
                var err = new Error('Forbidden');
                err.status = 403;
                next(err)
            }else{
                next
            }
        }
}


'use strict'
const session = require('express-session');
const constants = require('./constants.js')

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
        }
}


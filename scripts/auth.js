'use strict'
const session = require('session');
const constants = require('./constants.js')

module.exports = {
        admin:function(req,res,next){
            if( constants.admins.indexOf(req.session.user.email) != -1 ){
                next()
            }else{
                res.sendStatus(403)
            }
        },
        artist:function(req,res,next){
            if( req.body.id != req.session.user.id ){
                res.sendStatus(403)
            }else{
                next()
            }
        }
}


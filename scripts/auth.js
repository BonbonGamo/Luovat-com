'use strict'
const session = require('session');
const constants = require('./constants.js')

module.exports = {
        admin:function(req,res,next){
            if(!req.session.user || constants.admins.indexOf(req.session.user.email) == -1 ){
                res.sendStatus(403)
            }else{
                next()
            }
        },
        artist:function(req,res,next){
            if(!req.session.user){
                res.redirect('/login')
            }else{
                next()
            }
        }
}


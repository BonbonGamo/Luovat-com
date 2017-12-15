const db          = require('./db.js')
const config      = require('../knexfile.js');
const constants   = require('./constants.js')

const User        = require('../models/user.js')
const Order       = require('../models/order.js')
const Order_User  = require('../models/order_user.js')


module.exports = () => {
    if(constants.dbLatest && !constants.dbEmpty){
        console.log('Migrating knex latest')
        db.migrate.latest([config]);
        resolve('OK')
    }
    return new Promise((resolve,reject) => { 
        console.log('Running migrations.')
        console.log('Clearing data: ', constants.dbEmpty ? 'Yes' : 'No')
        console.log('Running knex latest: ', constants.dbLatest ? 'Yes' : 'No')

        if(constants.dbEmpty && constants.env == "dev"){
            Order
            .query()
            .delete()
            .then(deleted => {
                console.log(deleted,' orders deleted deleted')
                return Order_User
                .query()
                .delete()
            })
            .then(deleted => {
                console.log(deleted,' order - user relations deleted')
                return User
                .query()
                .delete()
            })
            .then(deleted => {
                console.log(deleted,' users deleted')
                console.log('Migrating knex latest')
                db.migrate.latest([config]);
            })
            .then(resolve('OK'))
            .catch(err => {
                reject(err)
            })
        }
    })
}
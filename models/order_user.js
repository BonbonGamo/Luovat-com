'use strict'
const objection = require('objection');
const Model = objection.Model;
const constants = require('../scripts/constants.js');
const config = require('../knexfile.js');
const env = constants.migration;  
const knex = require('knex')(config[env]);
Model.knex(knex);

class Order_User extends Model{
    static get tableName() {
        return 'order_user';
    }

    static get jsonSchema () {
        return {
        type: 'object',
        properties: {
            id: {type: 'integer'},
            OrderId: {type: 'integer'},
            UserId: {type: 'integer'}
         }   
        };
    }

}

module.exports = Order_User;
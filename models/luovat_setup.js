'use strict'
const objection = require('objection');
const Model = objection.Model;
const constants = require('../scripts/constants.js');
const config = require('../knexfile.js');
const env = constants.migration;  
const knex = require('knex')(config[env]);
Model.knex(knex);

class Order extends Model{
    static get tableName() {
        return 'luovat_order';
    }

    static get jsonSchema () {
        return {
        type: 'object',
        required: [],
        properties: {
            id: {type: 'integer'},
            version:{type:'integer'},
            packagePriceS:{type:'integer'},
            packagePriceM:{type:'integer'},
            packagePriceL:{type:'integer'},
            packagePriceXL:{type:'integer'} 
         }   
        };
    }

}
module.exports = Order;
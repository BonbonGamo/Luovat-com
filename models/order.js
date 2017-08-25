'use strict'

const objection = require('objection');
const Model = objection.Model;
const constants = require('../scripts/constants.js');
const config = require('../knexfile.js');
const env = constants.migration;  
const knex = require('knex')(config[env]);
Model.knex(knex);

class Orded extends Model{
    static get tableName() {
        return 'luovat_order';
    }

    commission(){
        return this.total * 0.3;
    }

    artistCut(){
        return this.total * 0.7;
    }

    static get jsonSchema () {
        return {
        type: 'object',
        required: [],
        properties: {
            id: {type: 'integer'},
            clientName: {type: 'string'},
            clientEmail: {type: 'string'},
            clientMessage:{type:'string'},
            clientPhone:{type:'string', minLength: 8, maxLength: 16},
            password:{type:'string'},
            passwordChangeToken:{type:'string'},
            street: {type: 'string'},
            city: {type: 'string'},
            zipCode: {type: 'string'},
            payment:{type: 'string'},
            reelLink: {type: 'string'},
            reelPassword:{type: 'string'},
            total:{type: 'number'},
            invoice20:{type: 'string'},
            invoice80:{type:'boolean'},
         }   
        };
    }
}

module.exports = Order;
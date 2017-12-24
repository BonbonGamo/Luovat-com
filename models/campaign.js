'use strict'
const objection = require('objection');
const Model = objection.Model;
const constants = require('../scripts/constants.js');
const config = require('../knexfile.js');
const env = constants.migration;  
const knex = require('knex')(config[env]);

Model.knex(knex);

class Campaign extends Model{
    static get tableName() {
        return 'luovat_campaign';
    }

    static get jsonSchema () {
        return {
        type: 'object',
        required: [],
        properties: {
            id: {type: 'integer'},
            campaignName:{type:'string'},
            campaignCode:{type:'string'},
            isActive:{type:'boolean'},
            starts:{type:'string'},
            ends:{type:'string'},
            madeBy:{type:'string'},
            editedBy:{type:'string'},
            condition:{type:'string'},
            percent:{type:'integer'}
         }   
        };
    }

}
module.exports = Campaign;
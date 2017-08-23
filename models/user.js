'use strict'

const objection = require('objection');
const Model = objection.Model;
const constants = require('../scripts/constants.js');
const config = require('../knexfile.js');
const env = constants.migration;  
const knex = require('knex')(config[env]);
Model.knex(knex);

class User extends Model{
    static get tableName() {
        return 'luovat_user';
    }

    fullName() {
        return this.firstName + ' ' + this.lastName;
    }

    nickName() {
        return this.firstName + ' ' + this.lastName[0]
    }

    static get jsonSchema () {
        return {
        type: 'object',
        required: [],
        properties: {
            id: {type: 'integer'},
            firstName: {type: 'string', minLength: 1, maxLength: 255},
            lastName: {type: 'string', minLength: 1, maxLength: 255},
            email:{type:'string'},
            phone:{type:'string', minLength: 8, maxLength: 16},
            password:{type:'string'},
            passwordChangeToken:{type:'string'},
            street: {type: 'string'},
            city: {type: 'string'},
            zipCode: {type: 'string'},
            payment:{type: 'string'},
            reelLink: {type: 'string'},
            reelPassword:{type: 'string'},
            balance:{type: 'number'},
            rekryMessage:{type: 'string'},
            employee:{type:'boolean'},

         }   
        };
    }
}

module.exports = User;
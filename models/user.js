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
            userLevel:{type: 'string'},
            userToken:{type:'string'},
            activeUser:{type:'boolean'},
            accessToken:{type:'string'},
            firstName: {type: 'string', minLength: 1, maxLength: 255},
            lastName: {type: 'string', minLength: 1, maxLength: 255},
            email:{type:'string'},
            phone:{type:'string'},
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
            deleted:{type:'boolean'},
            minor:{type:'boolean'}
            }     
        };
    }

    // static get relationMappings() {
    //     const Order = require('./order.js')
    //     const Order_User = require('./order_user.js')

    //     return{
    //         orders: {
    //             relation: Model.ManyToManyRelation,
    //             modelClass: Order,
    //             join: {
    //                 from: 'luovat_order.id',
    //                 through: {
    //                     from: 'order_user.userId',
    //                     to: 'orded_user.orderId'
    //                 },
    //                 to: 'luovat_user.id'
    //             }
    //         }
    //     }
    // }
}

module.exports = User;
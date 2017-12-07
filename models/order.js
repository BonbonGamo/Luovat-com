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
            clientCompany: {type:'string'},
            clientEmail: {type: 'string'},
            clientMessage:{type:'string'},
            clientPhone:{type:'string'},
            clientToken:{type:'string'},
            eager:{type:'number'},
            eagerMax:{type:'number'},
            eagerExpires:{type:'string'},
            artistSelection:{type:'number'},
            eventCity: {type: 'string'},
            eventDate:{type:'string'},
            eventSize: {type: 'string'},
            eventDescription: {type: 'string'},
            extraHours:{type:'number'},
            additional1:{type: 'boolean'},
            additional2:{type: 'boolean'},
            additional3:{type: 'boolean'},
            total:{type: 'number'},
            revenue:{type:'number'},
            ready:{type:'boolean'},
            discountPercent:{type:'number'},
            pending:{type:'boolean'},
            pendingFreedBy:{type:'string'},
            pendingFreedAt:{type:'string'},
            invoice20:{type:'boolean'},
            invoice20MadeBy:{type:'string'},
            invoice20Number:{type:'string'},
            invoice100:{type:'boolean'},
            invoice100MadeBy:{type:'string'},
            invoice100Number:{type:'string'},
            closed:{type:'boolean'}, //ONLY WHEN PAID TO ARTIST
            closedBy:{type:'string'},
            deleted:{type:'boolean'}
         }   
        };
    }

    static get relationMappings() {
        const User = require('./user.js')
        const Order_User = require('./order_user.js')

        return{
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'luovat_user.id',
                    through: {
                        from: 'order_user.userId',
                        to: 'order_user.orderId'
                    },
                    to: 'luovat_order.id'
                }
            }
        }
    }
}
module.exports = Order;
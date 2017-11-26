
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.alterTable('luovat_user', function(t) {
            table.boolean('activeUser')
        }),
        knex.schema.alterTable('luovat_order', function(t) {
            
        }),
        knex.schema.alterTable('luovat_setup', function(t) {
            
        }),
        knex.schema.alterTable('order_user', function(t) {
            
        })
    ]);
};

exports.down = function(knex, Promise) {
  
};

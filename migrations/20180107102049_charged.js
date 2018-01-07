
exports.up = function(knex, Promise) {
    return knex.schema.table('luovat_order', function(t){
        t.integer('charged')
    });
};

exports.down = function(knex, Promise) {
  
};

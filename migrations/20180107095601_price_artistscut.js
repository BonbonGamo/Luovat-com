
exports.up = function(knex, Promise) {
    return knex.schema.table('luovat_order', function(t){
        t.integer('artistsCut')
        t.integer('price')
    });
};

exports.down = function(knex, Promise) {
  
};

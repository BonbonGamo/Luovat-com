
exports.up = function(knex, Promise) {
    return knex.schema.table('luovat_order', function(t){
        t.string('invoice20CreatedAt')
        t.string('invoice100CreatedAt')
        t.integer('voiceOverPrice')
    })
};

exports.down = function(knex, Promise) {
  
};

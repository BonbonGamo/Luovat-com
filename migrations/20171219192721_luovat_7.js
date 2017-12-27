
exports.up = function(knex, Promise) {
    return Promise.all([
        knex.schema.table('luovat_user', function(t){
            // t.string('userLevel')
        }),
        knex.schema.table('luovat_order', function(t){
            // t.string('invoice20CreatedAt')
            // t.string('invoice100CreatedAt')
            // t.integer('voiceOverPrice')
        })   
    ]) 
};

exports.down = function(knex, Promise) {
  
};

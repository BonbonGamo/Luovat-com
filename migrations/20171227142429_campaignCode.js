exports.up = function(knex, Promise) {

    return knex.schema.table('luovat_order', function(t){
        t.string('campaignCode')
    });
    
};

exports.down = function(knex, Promise) {
  
};
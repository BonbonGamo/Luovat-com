exports.up = function(knex, Promise) {

    return knex.schema.table('luovat_campaign', function(t){
        t.string('campaignName')
    });
    
};

exports.down = function(knex, Promise) {
  
};

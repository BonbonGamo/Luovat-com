
exports.up = function(knex, Promise) {
    return Promise.all([
        // knex.schema.createTable('luovat_campaign',function(table){
        //     // table.increments('id').primary();
        //     // table.string('campaignName');
        //     // table.string('campaignCode');
        //     // table.boolean('isActive');
        //     // table.string('starts');
        //     // table.string('ends');
        //     // table.string('madeBy');
        //     // table.string('editedBy');
        //     // table.string('condition');
        //     // table.integer('percent');
        // })
    ])
};

exports.down = function(knex, Promise) {
  
};

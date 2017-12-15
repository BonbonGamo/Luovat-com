
exports.up = function(knex, Promise) {
  return knex.schema.table('luovat_user', function(t){
      t.boolean('minor')
      t.string('userToken')
  })
};

exports.down = function(knex, Promise) {
  
};


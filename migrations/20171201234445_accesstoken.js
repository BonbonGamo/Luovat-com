
exports.up = function(knex, Promise) {
    return knex.schema.table('luovat_user', function (t) {
        t.string('accessToken');
  });
};

exports.down = function(knex, Promise) {
  
};


exports.up = function(knex, Promise) {
    return knex.Schema.table('luovat_user', function (t) {
        t.string('accessToken');
  });
};

exports.down = function(knex, Promise) {
  
};

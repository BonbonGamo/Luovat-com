
exports.up = function(knex, Promise) {
    return knex.schema.table('luovat_order', function (t) {
        // t.string('pendingFreedAt');
  });
};

exports.down = function(knex, Promise) {
  
};

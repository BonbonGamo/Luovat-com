exports.up = function(knex, Promise) {
  
    return Promise.all([
        knex.schema.dropTable('luovat_user'),
        knex.schema.createTable('luovat_user',function(table){
            table.increments('id').primary();
            table.string('firstName');
            table.string('lastName');
            table.string('email').unique();
            table.string('phone');
            table.string('password');
            table.string('passwordChangeToken');
            table.string('street');
            table.string('city');            
            table.string('zipCode');
            table.string('payment');
            table.string('reelLink');
            table.string('reelPassword');
            table.integer('balance');
            table.string('rekryMessage')
            table.boolean('employee')
            table.boolean('deleted')
            table.boolean('admin')
            table.timestamps(true,true);
        })

    ])

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('luovat_user'),
    ])
};
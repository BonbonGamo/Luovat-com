exports.up = function(knex, Promise) {
  
    return Promise.all([
        knex.schema.createTable('user',function(table){
            table.increments('id').primary();
            table.string('firstName');
            table.string('lastName');
            table.string('email');
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
            table.timestamps();
        })

    ])

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('users'),
    ])
};
exports.up = function(knex, Promise) {
  
    return Promise.all([
        knex.schema.dropTable('luovat_user'),
        knex.schema.dropTable('luovat_order'),
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
        }),
        knex.schema.createTable('luovat_order',function(table){
            table.increments('id').primary();
            table.string('clientToken')
            table.string('clientName');
            table.string('clientCompany');
            table.string('clientEmail');
            table.string('clientMessage');
            table.string('clientPhone');
            table.integer('eager');
            table.integer('eagerMax');
            table.string('eagerExpires');
            table.integer('artistSelection');
            table.string('artistStatus');
            table.string('eventCity');
            table.string('eventDate');
            table.string('eventSize');
            table.string('eventDescription');
            table.integer('extraHours');
            table.boolean('additional1');
            table.boolean('additional2');
            table.boolean('additional3');
            table.integer('discountPercent');
            table.integer('total');
            table.boolean('pending');
            table.string('pendingFreeBy')
            table.boolean('invoice20');
            table.string('invoice20MadeBy')
            table.boolean('invoice100');
            table.string('invoice100MadeBy')
            table.boolean('closed');
            table.string('closedBy');
            table.boolean('deleted');
            table.timestamps(true,true);
        }),
        knex.schema.createTable('luovat_setup',function(table){
            table.increments('id').primary();
            table.integer('version');
            table.integer('packagePriceS');
            table.integer('packagePriceM');
            table.integer('packagePriceL');
            table.integer('packagePriceXL');
            table.timestamps(true,true);
        }),
        knex.schema.createTable('order_user',function(table){
            table.increments('id').primary();
            table.integer('orderId');
            table.integer('userId');
            table.timestamps(true,true);
        })

    ])

};

exports.down = function(knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('luovat_user'),
        knex.schema.dropTable('luovat_order'),
        knex.schema.dropTable('order_user'),
        knex.schema.dropTable('luovat_setup')
    ])
};
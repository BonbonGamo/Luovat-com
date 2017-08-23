'use strict'
module.exports = {
    //SERVER SETTINGS
    port:process.env.PORT,
    host:process.env.HOST,

    //DATABASE SETTINGS
    migration:'dev', //dev prod
    dbConnection:process.env.DATABASE_URL || 'postgres://localhost:5432/luovat'
}


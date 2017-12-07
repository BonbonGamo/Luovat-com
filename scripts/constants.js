'use strict'
module.exports = {
    //SERVER SETTINGS
    port:process.env.PORT,
    host:process.env.HOST,
    sessionSecret:'superSecret',

    //localEnv
    env:'dev',
    
    //USER SETTINGS
    admins:[
        'petteri@huddle.fi', //index 0 = dev contact for sent emails
        'ville@huddle.fi',
        'jasu@siitarinen.fi'
    ],
    

    //DATABASE SETTINGS
    migration:'dev', //dev prod
    dbConnection:process.env.DATABASE_URL || 'postgres://localhost:5432/luovat',
    redis:process.env.REDIS_URL,
    //POSTMARK AND EMAIL SETTINGS
    emailFrom:'info@luovat.com',

}


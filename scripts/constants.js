'use strict'
module.exports = {
    
    /*
    ---------------------------------------------------------------------------
    **************************    SERVER SETTINGS   ***************************

    -port:
        * heroku port
    -host
        * heroku host
    -sessionsecret
    -env
        *environment dev / prod
    ---------------------------------------------------------------------------
    */

    port:process.env.PORT,
    host:process.env.HOST,
    sessionSecret:'superSecret',
    env:'dev',
    
    /*
    ---------------------------------------------------------------------------
    **************************    ADMIN ACCOUNTS    ***************************

    -admins:
        * Manage users that can get access to admin page
        * admins[0] is the contact for the dev environment emails
    ---------------------------------------------------------------------------
    */
    admins:[
        'petteri@huddle.fi', //index 0 = dev contact for sent emails
        'ville@huddle.fi',
        'jasu@siitarinen.fi'
    ],
    /*
    ---------------------------------------------------------------------------
    *************************   DATABASE SETTINGS   ***************************

    -migration:
        * knex environment dev / prod
    -dbConnection:
        * DB URL
    -redis:
        * REDIS URL
    -dbEmpty
        * Delete all rows from all tables
    -dbLatest
        * Migrate latest knex migration made
    ---------------------------------------------------------------------------
    */
    migration:'dev',
    dbConnection:process.env.DATABASE_URL || 'postgres://localhost:5432/luovat',
    redis:process.env.REDIS_URL,
    dbEmpty:true,
    dbLatest:true,

    /*
    ---------------------------------------------------------------------------
    ***************************   POSTMARK SETTINGS   ***************************
    - emailFrom
        * Postmark sender email address


    ---------------------------------------------------------------------------
    */
    emailFrom:'info@luovat.com',


    /*
    ---------------------------------------------------------------------------
    ***************************   SYSTEM SETTINGS   ***************************
    - orderWaitDays
        * How old orders with at least one artist pickup will be freed to
          select artist dialog.


    ---------------------------------------------------------------------------
    */
    orderWaitDays:3,
}


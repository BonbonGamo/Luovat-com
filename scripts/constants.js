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
        * environment dev / prod
        * EFFECTS:
            -email reseavers (if dev then admins[0] else "to field")

    ---------------------------------------------------------------------------
    */

    port:process.env.PORT,
    host:process.env.HOST,
    sessionSecret:'superSecret',
    env:'prod',
    
    /*
    ---------------------------------------------------------------------------
    **************************    ADMIN ACCOUNTS    ***************************

    -admins:
        * Manage users that can get access to admin page
        * admins[0] is the contact for the dev environment emails
    -superuser:
        * The account created when the db tables are cleared. Takes a email
        * Super user password change token
            url: /artists/change-password/petteri-on-mestari'

    ---------------------------------------------------------------------------
    */
    admins:[
        'petteri@huddle.fi', //index 0 = dev contact for sent emails
        'ville@huddle.fi',
        'jasu@siitarinen.fi',
        'jan@justvisual.fi'
    ],

    superUser:'petteri@huddle.fi',

    superUserPwdToken:'petteri-on-mestari',
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
    dbEmpty:false,
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


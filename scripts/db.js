var config      = require('../knexfile.js');
var constants   = require('./constants.js')
var env         = constants.migration;  
var knex        = require('knex')(config[env]);

module.exports = knex;

console.log('DB:',process.env.DATABASE_URL)

knex.migrate.latest([config]); 
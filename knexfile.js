// Update with your config settings.
'use strict'

module.exports = {
  client:'pg',
  dev:{
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://localhost:5432/luovat'
  }
};

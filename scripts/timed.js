const CronJob = require('cron').CronJob;
const helper = require('./helper')

module.exports = () => {

//TEST
new CronJob('00 30 21 * * 1-5', function() {
    console.log('Check for orders to release');
    helper.checkForOrdersToRelease();
  }, null, true, 'America/Los_Angeles');

}
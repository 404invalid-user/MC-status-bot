/*
 *
 * config file
 * in enabled set value to true when you want it enabled and false when you want it disabled
 * pingInterval is the length of time between pings in minutes
 * debug should ALWAYS be false for production it logs a lot of information to the console which can slow down the application and pose as a security risk
 */
module.exports = {
  webserver: {
    enabled: true,
    port: 5000
  },
  pinger: {
    interval: '3',
    enabled: true,
    runAtStart: false
  },
  debug: false
}

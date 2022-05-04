/*
 *
 * config file
 * in enabled set value to true when you want it enabled and false when you want it disabled
 * 
 */
module.exports = {
    webserver: {
        enabled: true,
        port: parseFloat(process.argv[2]) || 5000
    },
    pinger: {
        //the length of time between pings in minutes
        interval: '3',
        enabled: true,
        runAtStart: false
    },

    //debug should ALWAYS be false for production it logs a lot of information to the console which can slow down the application and pose as a security risk
    debug: true,

    //disable this if you dont want me (the maintainer) to receive errors your bot gets
    //i recive 
    //the error your bot gets
    //the date it happende 
    //your bots id (to track were it cam from)
    //your id (to contact you if your in the server)

    errorSend: true,

}
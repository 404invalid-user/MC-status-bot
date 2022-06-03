const { AdvancedLogger } = require('@404invalid-user/logger');

const loggerConfig = {
    filePath: './logs.log',
    webhook: {
        discord: 'https://discord.com/api/webhook/blblbalabla'
    },
    debug: true,
    success: {
        logPath: './logs/success.log',
        webhook: {
            discord: process.env.LOGHOOK
        }
    },
    error: {
        logPath: './logs/error.log',
        webhook: {
            discord: process.env.LOGHOOK
        }
    },
    info: {
        logPath: './logs/info.log',
        webhook: {
            discord: process.env.LOGHOOK
        }
    },
    warn: {
        logPath: './logs/warn.log',
        webhook: {
            discord: process.env.LOGHOOK
        }
    },
    crash: {
        logPath: './logs/crash.log',
        webhook: {
            discord: process.env.LOGHOOK
        }
    }
}
const log = new AdvancedLogger(loggerConfig);
module.exports = log;
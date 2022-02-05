const fs = require('fs')
const moment = require('moment')
const chalk = require('chalk');
const { WebhookClient } = require('discord.js')

function append(text) {
    fs.appendFileSync(__dirname + '/../log.log', text + '\n', function(err) {
        if (err) console.error(chalk.red('Error writing logs to file: ' + err))
    })
    if (process.env.LOGHOOK) {
        const webhookClient = new WebhookClient({ url: process.env.LOGHOOK });
        webhookClient.send({ content: text.toString() });
    }
}


module.exports = logger = {
    info: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stdout.write(chalk.gray(`${time} [info]: `) + text + '\n')

        append(time + ' [info]: ' + text)
    },
    success: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stdout.write(chalk.gray(`${time} [${chalk.green('success')}]: `) + text + '\n')

        append(time + ' [success]: ' + text)
    },
    error: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.red('error')}]: `) + chalk.red(text) + '\n')

        append(time + ' [error]: ' + text)
    },
    warn: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.yellow('warn')}]: `) + text + '\n')

        append(time + ' [warn]: ' + text)
    },
    crash: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.red('CRASH')}]: `) + text + '\n')

        append(time + ' [CRASH]: ' + text)
    }
}
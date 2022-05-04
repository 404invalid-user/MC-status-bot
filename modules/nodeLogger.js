const fs = require('fs')
const moment = require('moment')
const chalk = require('chalk')
const { WebhookClient } = require('discord.js')
const axios = require('axios');
const config = require('../config')

function append(text) {
    fs.appendFileSync(__dirname + '/../log.log', text + '\n', function(err) {
        if (err) console.error(chalk.red('Error writing logs to file: ' + err))
    })
    if (process.env.LOGHOOK) {
        const webhookClient = new WebhookClient({ url: process.env.LOGHOOK })
        webhookClient.send({ content: text.toString() })
    }
}

const errorinfo = {
    bot: {
        id: process.env.client_id,
        name: 'no name',
        avatar: 'https://mcstatusbot.site/icon.png'
    },
    owner: process.env.OWNERID,
}

module.exports = logger = {
    setdata(name, avatar) {
        errorinfo.bot.name = name;
        errorinfo.bot.avatar = avatar;
        console.log(name, avatar)
    },
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

        if (config.errorSend) {
            axios.post('https://faq.mcstatusbot.site/error', { bot: errorinfo.bot, owner: process.env.OWNERID, site: process.env.DOMAIN, error: text, date: Date.now() }).then(s => {
                module.exports.info("sent error report to bot maintainer")
            }).catch(err => {
                console.log(err)
            })
        }
        append(time + ' [error]: ' + text);
    },
    warn: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.yellow('warn')}]: `) + text + '\n')

        append(time + ' [warn]: ' + text)
    },
    crash: function(text) {
        let time = moment().format('YYYY-MM-DD HH:mm:ss')
        process.stderr.write(chalk.gray(`${time} [${chalk.red('CRASH')}]: `) + text + '\n')
        axios.post('https://faq.mcstatusbot.site/error', { bot: errorinfo.bot, owner: errorinfo.owner, site: process.env.DOMAIN, error: text, date: Date.now() }).then(s => {
            module.exports.info("sent crash report to bot maintainer")
        }).catch(err => {
            console.log(err)
        })

        append(time + ' [CRASH]: ' + text)
    }
}
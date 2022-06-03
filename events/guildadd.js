const cache = require('../modules/cache.js')
const Server = require('../database/ServerSchema')
const logger = require('../modules/nodeLogger.js')
module.exports = {
    name: 'guildCreate',
    execute(guild) {
        logger.info(`Joined new guild: ${guild.name} (${guild.id})`);
        module.exports.addGuild(guild.id);
    },
    async addGuild(guild) {
        //add server to db with config files
        Server.create({
                _id: guild,
                checker: {
                    channel: {
                        status: 'offline',
                        members: '0'
                    },
                    notification: {
                        status: 'offline',
                        members: '0'
                    }
                },
                config: {
                    notifications: {
                        webhook: {
                            enabled: false,
                            url: 'http://nice.webhook.mcstatusbot.site/',
                            content: '[ip] is [status]',
                            for: { online: false, offline: false }
                        },
                        email: {
                            enabled: false,
                            emails: ['no-one@mcstatusbot.site'],
                            subject: '[ip] is [status]',
                            content: 'hello, this is an automated email saying [ip] is [status]',
                            for: { online: false, offline: false }
                        }
                    },
                    chart: {
                        enabled: true,
                        embed: {
                            uptime: {
                                title: "[ip]'s uptime",
                                description: '[ip] was up for [uptime] minutes and down for [downtime] minutes. This means that [ip] has a uptime percentage of [onlinepercent] and downtime percentage of [offlinepercent]',
                                color: '#FFFFF'
                            },
                            playersonline: {
                                title: 'Number of players online on [ip]',
                                description: 'There have been a maximum of [maxplayers] players online at once, and a minimum of [minplayers].',
                                color: '#FFFFF'
                            },
                            mostactive: {
                                title: 'Most active players on [ip] in the last 24 hours',
                                description: '[mostactive] was the most active player with [mostactiveminutes] minutes spent online in the last 24 hours.',
                                color: '#FFFFF'
                            }
                        },
                        graph: {
                            text: {
                                title: '253, 253, 253',
                                time: '253, 253, 253',
                                state: '253, 253, 253'
                            },
                            line: {
                                fill: '8, 174, 228',
                                border: '39, 76, 113'
                            }
                        }
                    }
                }
            }).catch((err) => logger.error(err.stack || err))
            //add  server to cache
        const g = await Server.findOne({ _id: guild }).catch((err) => logger.error(err.stack || err));
        logger.info('Added the server db entry.')
        if (g == null) return console.log("bruh wty");
        cache.create('server', g._id, g)
    }
}
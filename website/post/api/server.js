const cache = require('../../../modules/cache')
const logger = require('../../../modules/nodeLogger')
const timezones = require('../../../modules/timezones')
const auditlog = require('../../../modules/auditlog')
const config = require('../../../config')
const Log = require('../../../database/logSchema')
const domainipverify = require('../../../modules/domainipverify');

const defaults = {
    emailsubject: "mcstatus update",
    emailbody: "hello member of [servername], your minecraft servers status has updated your server [ip] is now [status]."
}
module.exports = {
    path: '/api/server',
    async run(shards, req, res) {
        try {
            if (req.user == null) return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            const server = await cache.lookup('Server', req.body.data._id);
            if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            let serverAccess = false;
            if (req.user.guilds.filter(g => g._id == server._id && g.manage == true).length == 1) serverAccess = true;
            //let admins access any server
            if (req.user.admin) serverAccess = true;
            if (!serverAccess) {
                const errorid = await auditlog(server._id, req.user._id, true, "attempted access denied: server info update");
                if (config.debug) console.log('post /api/server userid: ' + req.user._id + ' serverid: ' + server._id + ' no access errorid: ' + errorid);
                return res.status(403).json({ message: '403: Forbidden you can not access this', errorid: errorid, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            }

            let beenError = false;
            let maxlength = 2000;



            //set and validate server ip
            if (req.body.data.IP !== server.IP) {
                const verifyIP = domainipverify(req.body.data.IP);
                if (verifyIP.valid) {
                    auditlog(server._id, req.user._id, false, "mc server ip updated to: " + req.body.data.IP.toLowerCase());
                    server.IP = req.body.data.IP;
                } else {
                    auditlog(server._id, req.user._id, true, "mc server ip falied to updated because invalid ip or domain");
                    beenError = true;
                }
            }

            //set and validate server logging
            if (req.body.data.Logging != server.Logging) {
                auditlog(server._id, req.user._id, false, "updated logging to: " + req.body.data.Logging);
                if (req.body.data.Logging) {
                    let logs = await cache.lookup('Log', interaction.guild.id);
                    if (logs == null) {
                        await Log.create({ _id: server._id });
                        logs = await cache.lookup('Log', interaction.guild.id);
                    };
                    server.Logging = true;
                    logs.logs = [];
                    logs.save();
                } else if (!req.body.data.Logging) {
                    server.Logging = false;
                    await cache.removeCache('Log', server._id);
                    Log.findOne({ _id: interaction.guild.id }).remove().catch((err) => logger.error(err));
                }
            }
            //set and validate timezone
            if (req.body.data.timezone !== server.timezone) {
                if (!timezones.includes(req.body.data.timezone)) {
                    auditlog(server._id, req.user._id, true, "server timezone falied to updated because invalid timezone provided");
                    beenError = true;
                } else {
                    server.timezone = req.body.data.timezone;
                    auditlog(server._id, req.user._id, false, "server timezone was updated to: " + req.body.data.timezone);
                }
            }

            //set and validate category id
            if (server.CategoryId != req.body.data.CategoryId) {
                if (!isNumeric(req.body.data.CategoryId) || req.body.data.CategoryId.split('').length > 18) {
                    auditlog(server._id, req.user._id, true, "server status channels category falied to updated because invalid id provided");
                    beenError = true;
                } else {
                    server.CategoryId = req.body.data.CategoryId;
                    auditlog(server._id, req.user._id, false, "server status channels category set to: " + req.body.data.CategoryId);
                }
            }
            //set and validate status channel id
            if (server.StatusChannId != req.body.data.StatusChannId) {
                if (!isNumeric(req.body.data.StatusChannId) || req.body.data.StatusChannId.split('').length > 18) {
                    auditlog(server._id, req.user._id, true, "server status channel falied to updated because invalid id provided");
                    beenError = true;
                } else {
                    server.StatusChannId = req.body.data.StatusChannId;
                    auditlog(server._id, req.user._id, false, "server status channel updated to: " + req.body.data.StatusChannId);
                }
            }
            //set and validate amount of players channel
            if (server.NumberChannId != req.body.data.NumberChannId) {
                if (!isNumeric(req.body.data.NumberChannId) || req.body.data.NumberChannId.split('').length > 18) {
                    auditlog(server._id, req.user._id, true, "server member channel falied to updated because invalid id provided");
                    beenError = true;
                } else {
                    server.NumberChannId = req.body.data.NumberChannId;
                    auditlog(server._id, req.user._id, false, "server member channel updated to: " + req.body.data.NumberChannId);
                }
            }
            //set and validate number of players channel enabled
            if (req.body.data.MemberChannEnabled != server.MemberChannEnabled) {
                let isMemberChannEnabled = req.body.data.MemberChannEnabled ? true : false;
                server.MemberChannEnabled = isMemberChannEnabled;
                auditlog(server._id, req.user._id, false, "server member channel enabled set to: " + isMemberChannEnabled);
            }
            //set and validate bedrock server mode
            if (req.body.data.Bedrock != server.Bedrock) {
                let isBedrock = req.body.data.Bedrock ? true : false;
                server.Bedrock = isBedrock;
                auditlog(server._id, req.user._id, false, "server bedrock set to: " + isBedrock);
            }

            const newConfig = req.body.data.config;


            //set and validate enable chart config
            if (newConfig.chart.enabled != server.config.chart.enabled) {
                let isenabled = newConfig.chart.enabled ? true : false;
                server.config.chart.enabled = isenabled;
                auditlog(server._id, req.user._id, false, "server custom charts enabled set to: " + isenabled);
            }
            //set and validate enable webhook notifications
            if (newConfig.notifications.webhook.enabled != server.config.notifications.webhook.enabled) {
                let isenabled = newConfig.notifications.webhook.enabled ? true : false;
                server.config.notifications.webhook.enabled = isenabled;
                auditlog(server._id, req.user._id, false, "sserver notifications webhook enabled set to: " + isenabled);
            }
            //set and validate enable email notifications
            if (newConfig.notifications.email.enabled != server.config.notifications.email.enabled) {
                let isenabled = newConfig.notifications.email.enabled ? true : false;
                server.config.notifications.email.enabled = isenabled;
                auditlog(server._id, req.user._id, false, "sserver notifications email enabled set to: " + isenabled);
            }

            //hmmm got to love data validation
            if (newConfig.chart.enabled) {
                //loop though each chart embed object
                for (const [chartEmbedKey, chartEmbedValue] of Object.entries(newConfig.chart.embed)) {
                    //loop though title description and color of embed
                    for (const [embedKey, embedValue] of Object.entries(newConfig.chart.embed[chartEmbedKey])) {
                        //set and validate embed text config valuse
                        if (newConfig.chart.embed[chartEmbedKey][embedKey] != server.config.chart.embed[chartEmbedKey][embedKey]) {
                            if (embedValue == null) {
                                auditlog(server._id, req.user._id, true, `chartembed ${chartEmbedKey} ${embedKey} is null`);
                                beenError = true;
                            } else {
                                if (checklength(embedValue, maxlength)) {
                                    auditlog(server._id, req.user._id, true, `chartembed ${chartEmbedKey} ${embedKey} exeeds max length ${maxlength}`);
                                    beenError = true;
                                } else {
                                    server.config.chart.embed[chartEmbedKey][embedKey] = newConfig.chart.embed[chartEmbedKey][embedKey];
                                    auditlog(server._id, req.user._id, false, `updated chartembed ${chartEmbedKey} ${embedKey}`);
                                }
                            }
                        }
                    }
                }
                //loop though each graph text object
                for (const [graphTextKey, graphTextValue] of Object.entries(newConfig.chart.graph.text)) {
                    //set and validate chart text config values
                    if (server.config.chart.graph.text[graphTextKey] != newConfig.chart.graph.text[graphTextKey]) {
                        if (!graphTextValue.includes(',') || graphTextValue.split(', ').length !== 3) {
                            auditlog(server._id, req.user._id, true, `graph text ${graphTextKey} is not valid rgb colour`);
                            beenError = true;
                        } else {
                            server.config.chart.graph.text[graphTextKey] = newConfig.chart.graph.text[graphTextKey];
                            auditlog(server._id, req.user._id, false, `updated graph text ${graphTextKey}: ${newConfig.chart.graph.text[graphTextKey]}`);
                        }
                    }
                }
                //set and validate chart lines colours config
                if (server.config.chart.graph.line.fill != newConfig.chart.graph.line.fill) {
                    if (!newConfig.chart.graph.line.fill.includes(',') || newConfig.chart.graph.line.fill.split(', ').length !== 3) {
                        auditlog(server._id, req.user._id, true, `graph line fill is not valid rgb colour`);
                        beenError = true;
                    } else {
                        server.config.chart.graph.line.fill = newConfig.chart.graph.line.fill;
                        auditlog(server._id, req.user._id, false, `updated graph line fill: ${newConfig.chart.graph.line.fill}`);
                    }
                }
                if (server.config.chart.graph.line.border != newConfig.chart.graph.line.border) {
                    if (!newConfig.chart.graph.line.border.includes(',') || newConfig.chart.graph.line.border.split(', ').length !== 3) {
                        auditlog(server._id, req.user._id, true, `graph line border is not valid rgb colour`);
                        beenError = true;
                    } else {
                        server.config.chart.graph.line.border = newConfig.chart.graph.line.border;
                        auditlog(server._id, req.user._id, false, `updated graph line border: ${newConfig.chart.graph.line.border}`);
                    }
                }
            }
            //notifications config
            //validate webhook
            if (newConfig.notifications.webhook.enabled) {
                //validate webhook url
                if (server.config.notifications.webhook.url != newConfig.notifications.webhook.url) {
                    if (!newConfig.notifications.webhook.url.includes('.') || !newConfig.notifications.webhook.url.startsWith('http')) {
                        auditlog(server._id, req.user._id, true, `notifications webhook url is not a valid url`);
                        beenError = true;
                    } else {
                        server.config.notifications.webhook.url = newConfig.notifications.webhook.url;
                        auditlog(server._id, req.user._id, false, `updated notifications webhook url: ${newConfig.notifications.webhook.url}`);
                    }
                }
                if (server.config.notifications.webhook.content != newConfig.notifications.webhook.content) {
                    if (checklength(newConfig.notifications.webhook.content, maxlength)) {
                        auditlog(server._id, req.user._id, true, `notifications webhook content exeeds max length ${maxlength}`);
                        beenError = true;
                    } else {
                        server.config.notifications.webhook.content = newConfig.notifications.webhook.content;
                        auditlog(server._id, req.user._id, false, `updated notifications webhook content`);
                    }
                }
                if (newConfig.notifications.webhook.for.online != server.config.notifications.webhook.for.online) {
                    let isenabled = newConfig.notifications.webhook.for.online ? true : false;
                    server.config.notifications.webhook.for.online = isenabled;
                    auditlog(server._id, req.user._id, false, 'server webhook online notifications enabled set to: ' + isenabled);
                }
                if (newConfig.notifications.webhook.for.offline != server.config.notifications.webhook.for.offline) {
                    let isenabled = newConfig.notifications.webhook.for.offline ? true : false;
                    server.config.notifications.webhook.for.offline = isenabled;
                    auditlog(server._id, req.user._id, false, 'server webhook offline notifications enabled set to: ' + isenabled);
                }
            }

            //validate email
            if (newConfig.notifications.email.enabled) {
                if (server.config.notifications.email.emails != newConfig.notifications.email.emails) {
                    let validEmails = [];
                    for (const email of newConfig.notifications.email.emails) {
                        if (!email.includes('@') || !email.includes('.')) {
                            auditlog(server._id, req.user._id, true, "an email has not been added because invalid email");
                            beenError = true;
                        } else {
                            if (email.split('@')[0].split('').length > 256) {
                                auditlog(server._id, req.user._id, true, "an email has not been added because too long");
                                beenError = true;
                            } else {
                                validEmails.push(email);
                            }
                        }
                    };
                    server.config.notifications.email.emails = validEmails;
                    auditlog(server._id, req.user._id, false, `emails updated: ${validEmails.join(' ')}`);
                }
                if (server.config.notifications.email.subject != newConfig.notifications.email.subject) {
                    if (checklength(newConfig.notifications.email.subject, 2000)) {
                        auditlog(server._id, req.user._id, true, `email subject set to default because provided too long`);
                        server.config.notifications.email.subject = defaults.emailsubject;
                        beenError = true;
                    } else {
                        server.config.notifications.email.subject = newConfig.notifications.email.subject;
                        auditlog(server._id, req.user._id, false, `email subject updated: ${newConfig.notifications.email.subject}`);
                    }
                    if (server.config.notifications.email.content != newConfig.notifications.email.content) {
                        if (checklength(newConfig.notifications.email.content, 2000)) {
                            auditlog(server._id, req.user._id, true, `email body set to default because provided too long`);
                            beenError = true;
                            server.config.notifications.email.body = defaults.emailbody;
                        } else {
                            server.config.notifications.email.body = newConfig.notifications.email.body;
                            auditlog(server._id, req.user._id, false, `email body updated: ${newConfig.notifications.email.content}`);
                        }
                    }
                }
                if (newConfig.notifications.email.for.online != server.config.notifications.email.for.online) {
                    let isenabled = newConfig.notifications.email.for.online ? true : false;
                    server.config.notifications.email.for.online = isenabled;
                    auditlog(server._id, req.user._id, false, 'server emails online notifications enabled set to: ' + isenabled);
                }
                if (newConfig.notifications.email.for.offline != server.config.notifications.email.for.offline) {
                    let isenabled = newConfig.notifications.email.for.offline ? true : false;
                    server.config.notifications.webhook.for.offline = isenabled;
                    auditlog(server._id, req.user._id, false, 'server email offline notifications enabled set to: ' + isenabled);
                }
            }
            await server.save();
            if (beenError) {
                return res.status(200).json({ message: '200400: success with errors', errorid: '0', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            }
            return res.status(200).json({ message: '200: success', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        } catch (err) {
            logger.error(err.stack || err)
            return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        }
    }
}

const checklength = (txt, len) => {
    const length = parseFloat(len) ? parseFloat(len) : 2000
    if (txt.split('').length > length) {
        return true
    } else {
        return false
    }
}

function isNumeric(str) {
    if (typeof str != 'string') return false // we only process strings!
    return (!isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
            !isNaN(parseFloat(str))
        ) // ...and ensure strings of whitespace fail
}
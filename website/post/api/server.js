const cache = require('../../../modules/cache');
const logger = require('../../../modules/nodeLogger');
const timezones = require('../../../modules/timezones');
const actionlog = require('../../../modules/actionlog');
const config = require('../../../config')
module.exports = {
    path: '/api/server',
    async run(shards, req, res) {
        try {
            if (req.user == null) return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            const server = await cache.lookup('Server', req.body.data._id);
            if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            let canAccessServer = false;
            for (const g of req.user.guilds) {
                if (g._id == server._id && g.manage == true) {
                    canAccessServer = true;
                }
            }
            //let admins access any server
            if (req.user.admin) canAccessServer = true;
            if (!canAccessServer) {
                const errorid = await actionlog(server._id, req.user._id, 'post_server-access', 'attempted access denied')
                if (config.debug) console.log("post /api/server userid: " + req.user._id + " serverid: " + server._id + " no access errorid: " + errorid);
                return res.status(403).json({ message: '403: Forbidden you can not access this', errorid: errorid, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            };

            let beenError = false;
            let errorReasons = "";
            let actions = "";
            let maxlength = 2000;
            function addError(text) {
                if (config.debug) console.log("post /api/server added error");
               
                beenError = true;
                if (errorReasons == "") {
                    errorReasons += text;
                } else {
                    errorReasons += ", " + text;
                }
            }
            function addAction(text) {
                if (config.debug) console.log("post /api/server added action");
                if (actions == "") {
                    actions += text;
                } else {
                    actions += ", " + text;
                }
            }
            if (req.body.data.IP !== server.IP) {
                let ipArr = req.body.data.IP.split('.');
                if (ipArr.length <= 1) {
                    addError("failed to set ip to because invalid ip");
                } else if (ipArr.length == 2) {
                    if (ipArr[0].split('').length > 63) {
                        addError("failed to set ip to because domain too long");
                    } else {
                        server.IP = req.body.data.IP;
                        addAction("server ip was updated: " + req.body.data.IP);
                    }
                } else if (ipArr.length == 4) {
                    let ipover = false;
                    for (const i of ipArr) {
                        if (parseFloat(i) > 255) {
                            ipover = true;
                        }
                    }
                    if (ipover) {
                        addError("failed to set ip to because invalid ip");
                    } else {
                        addAction("server ip was updated: " + req.body.data.IP);
                    }
                }
            }

            if (req.body.data.timezone !== server.timezone) {
                if (!timezones.includes(req.body.data.timezone)) {
                    addError("timezone is invalid");
                } else {
                    server.timezone = req.body.data.timezone;
                    addAction("server timezone was updated: " + req.body.data.timezone);
                }
            }
            const newConfig = req.body.data.config
            if (server.CategoryId != req.body.data.CategoryId) {
                if (naa(req.body.data.CategoryId) || req.body.data.CategoryId.split('').length > 18) {
                    addError("new server category id is invalid");
                } else {
                    server.CategoryId = req.body.data.CategoryId
                    addAction("server category id set to: " + req.body.data.CategoryId);
                }
            }
            if (server.StatusChannId != req.body.data.StatusChannId) {
                if (naa(req.body.data.StatusChannId) || req.body.data.StatusChannId.split('').length > 18) {
                    addError("new server StatusChannel id is invalid");
                } else {
                    server.StatusChannId = req.body.data.StatusChannId
                    addAction("server StatusChannel id set to: " + req.body.data.StatusChannId);
                }
            }
            if (server.NumberChannId != req.body.data.NumberChannId) {
                if (naa(req.body.data.NumberChannId) || req.body.data.NumberChannId.split('').length > 18) {
                    addError("new server NumberChannel id is invalid");
                } else {
                    server.NumberChannId = req.body.data.NumberChannId
                    addAction("server NumberChannel id set to: " + req.body.data.NumberChannId);
                }
            }
            if (req.body.data.Bedrock != server.Bedrock) {
                let isBedrock = req.body.data.Bedrock ? true : false;
                server.Bedrock = isBedrock;
                addAction("server bedrock set to: " + isBedrock);
            }
            if (req.body.data.Logging != server.Logging) {
                let isLogging = req.body.data.Logging ? true : false;
                server.Logging = isLogging;
                addAction("server logging set to: " + Logging);
            }
            if (req.body.data.MemberChannEnabled != server.MemberChannEnabled) {
                let isMemberChannEnabled = req.body.data.MemberChannEnabled ? true : false;
                server.MemberChannEnabled = isMemberChannEnabled;
                addAction("server member channel enabled set to: " + isMemberChannEnabled);
            }

            if (newConfig.chart.enabled != server.config.chart.enabled) {
                let isenabled = newConfig.chart.enabled ? true : false;
                server.config.chart.enabled = isenabled;
                addAction("server custom charts enabled set to: " + isenabled);
            }
            if (newConfig.notifications.webhook.enabled != server.config.notifications.webhook.enabled) {
                let isenabled = newConfig.notifications.webhook.enabled ? true : false;
                server.config.notifications.webhook.enabled = isenabled;
                addAction("server notifications webhook enabled set to: " + isenabled);
            }
            if (newConfig.notifications.email.enabled != server.config.notifications.email.enabled) {
                let isenabled = newConfig.notifications.email.enabled ? true : false;
                server.config.notifications.email.enabled = isenabled;
                addAction("server notifications email enabled set to: " + isenabled);
            }

            //hmmm got to love data validation
            if (newConfig.chart.enabled) {
                //loop though each chart embed object
                for (const [chartEmbedKey, chartEmbedValue] of Object.entries(newConfig.chart.embed)) {
                    //loop though title description and color of embed
                    for (const [embedKey, embedValue] of Object.entries(newConfig.chart.embed[chartEmbedKey])) {
                        if (newConfig.chart.embed[chartEmbedKey][embedKey] != server.config.chart.embed[chartEmbedKey][embedKey]) {
                            if (embedValue == null) {
                                addError(`chartembed ${chartEmbedKey} ${embedKey} is null`);
                            } else {
                                let maxlength = 2000
                                if (checklength(embedValue, maxlength)) {
                                    addError(`chartembed ${chartEmbedKey} ${embedKey} exeeds max length ${maxlength}`);
                                } else {
                                    server.config.chart.embed[chartEmbedKey][embedKey] = newConfig.chart.embed[chartEmbedKey][embedKey];
                                    addAction(`updated chartembed ${chartEmbedKey} ${embedKey}`);
                                }
                            }
                        }
                    }
                }
                //loop though each graph text object
                for (const [graphTextKey, graphTextValue] of Object.entries(newConfig.chart.graph.text)) {
                    if (server.config.chart.graph.text[graphTextKey] != newConfig.chart.graph.text[graphTextKey]) {
                        if (!graphTextValue.includes(',') || graphTextValue.split(', ').length !== 3) {
                            addError(`graph text ${graphTextKey} is not valid rgb colour`);
                        } else {
                            server.config.chart.graph.text[graphTextKey] = newConfig.chart.graph.text[graphTextKey];
                            addAction(`updated graph text ${graphTextKey}: ${newConfig.chart.graph.text[graphTextKey]}`);
                        }
                    }
                }
                if (server.config.chart.graph.line.fill != newConfig.chart.graph.line.fill) {
                    if (!newConfig.chart.graph.line.fill.includes(',') || newConfig.chart.graph.line.fill.split(', ').length !== 3) {
                        addError(`graph line fill is not valid rgb colour`);
                    } else {
                        server.config.chart.graph.line.fill = newConfig.chart.graph.line.fill;
                        addAction(`updated graph line fill: ${newConfig.chart.graph.line.fill}`);
                    }
                }
                if (server.config.chart.graph.line.border != newConfig.chart.graph.line.border) {
                    if (!newConfig.chart.graph.line.border.includes(',') || newConfig.chart.graph.line.border.split(', ').length !== 3) {
                        addError(`graph line border is not valid rgb colour`);
                    } else {
                        server.config.chart.graph.line.border = newConfig.chart.graph.line.border;
                        addAction(`updated graph line border: ${newConfig.chart.graph.line.border}`);
                    }
                }
            }
            //notifications config
            //validate webhook
            if (newConfig.notifications.webhook.enabled) {
                //validate webhook url
                if (server.config.notifications.webhook.url != newConfig.notifications.webhook.url) {
                    if (!newConfig.notifications.webhook.url.includes('.') || !newConfig.notifications.webhook.url.startsWith('http')) {
                        addError(`notifications webhook url is not a valid url`);
                    } else {
                        server.config.notifications.webhook.url = newConfig.notifications.webhook.url;
                        addAction(`updated notifications webhook url: ${newConfig.notifications.webhook.url}`);
                    }
                }
                if (server.config.notifications.webhook.content != newConfig.notifications.webhook.content) {
                    if (checklength(newConfig.notifications.webhook.content, maxlength)) {
                        addError(`notifications webhook content exeeds max length ${maxlength}`);
                    } else {
                        server.config.notifications.webhook.content = newConfig.notifications.webhook.content;
                        addAction(`updated notifications webhook content`);
                    }
                }
                if (newConfig.notifications.webhook.for.online != server.config.notifications.webhook.for.online) {
                    let isenabled = newConfig.notifications.webhook.for.online ? true : false;
                    server.config.notifications.webhook.for.online = isenabled;
                    addAction("server webhook online notifications enabled set to: " + isenabled);
                }
                if (newConfig.notifications.webhook.for.offline != server.config.notifications.webhook.for.offline) {
                    let isenabled = newConfig.notifications.webhook.for.offline ? true : false;
                    server.config.notifications.webhook.for.offline = isenabled;
                    addAction("server email offline notifications enabled set to: " + isenabled);
                }
            }

            //validate email
            if (newConfig.notifications.email.enabled) {
                if (server.config.notifications.email.emails != newConfig.notifications.email.emails) {
                    let validEmails = [];
                    for (const email of newConfig.notifications.email.emails) {
                        if (!email.includes('@') || !email.includes('.')) {
                            addError(`invalid email has not been added reason: invalid email`);
                        } else {
                            if (email.split('@')[0].split('').length > 256) {
                                addError(`invalid email has not been added reason: toolong`);
                            } else {
                                validEmails.push(email);
                            }
                        }
                    }
                    server.config.notifications.email.emails = validEmails;
                    addAction(`emails updated: ${validEmails.join(' ')}`);
                }
                if (server.config.notifications.email.subject != newConfig.notifications.email.subject) {
                    if (checklength(newConfig.notifications.email.subject, 2000)) {
                        addError(`email subject too long`);
                    } else {
                        server.config.notifications.email.subject = newConfig.notifications.email.subject;
                        addAction(`email subject updated: ${newConfig.notifications.email.subject}`);
                    }
                    if (server.config.notifications.email.content != newConfig.notifications.email.content) {
                        if (checklength(newConfig.notifications.email.content, 2000)) {
                            addError(`email body too long`);
                        } else {
                            server.config.notifications.email.subject = newConfig.notifications.email.subject;
                            addAction(`email body updated: ${newConfig.notifications.email.content}`);
                        }
                    }
                }
                if (newConfig.notifications.email.for.online != server.config.notifications.email.for.online) {
                    let isenabled = newConfig.notifications.email.for.online ? true : false;
                    server.config.notifications.email.for.online = isenabled;
                    addAction("server emails online notifications enabled set to: " + isenabled);
                }
                if (newConfig.notifications.email.for.offline != server.config.notifications.email.for.offline) {
                    let isenabled = newConfig.notifications.email.for.offline ? true : false;
                    server.config.notifications.webhook.for.offline = isenabled;
                    addAction("server email offline notifications enabled set to: " + isenabled);
                }
            }
            await server.save();
            actionlog(server._id, req.user._id, 'server-update_action', actions);
            if (beenError) {
                const errorid = await actionlog(server._id, req.user._id, 'server-update_error', errorReasons);
                return res.status(200).json({ message: '200400: success with errors', errorid: errorid, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
            }
            return res.status(200).json({ message: '200: success', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        } catch (err) {
            logger.error(err.stack || err)
            return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' });
        }
    }
}

const checklength = (txt, len) => {
    const length = parseFloat(len) ? parseFloat(len) : 2000;
    if (txt.split('').length > length) {
        return true;
    } else {
        return false;
    }
};

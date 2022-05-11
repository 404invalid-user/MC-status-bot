const axios = require('axios');
const sendEmail = require('./sendemail');
const auditlog = require('./auditlog');

module.exports = async(server) => {
    if (!server.config.notifications) return;
    if (!server.checker) {
        server['checker'] = {
            channel: {
                status: 'offline',
                members: '0'
            },
            notification: {
                status: 'offline',
                members: '0'
            }
        }
        return;
    }
    if (!server.checker.notification) {
        server.checker.notification = {
            status: server.pinger.status == 'online' ? 'offline' : 'online',
            members: '0'
        }
    }
    if (server.checker.notification.status !== server.pinger.status) {
        if (server.config.notifications.webhook.enabled && server.config.notifications.webhook.url != undefined && server.config.notifications.webhook.url != "" && server.config.notifications.webhook.url != " " && server.config.notifications.webhook.url.includes("http")) {
            webhook(server, server.config.notifications.webhook, server.pinger);
        }

        if (server.config.notifications.email.enabled && server.config.notifications.email.emails.length >= 1) {
            email(server, server.config.notifications.email, server.pinger);
        }

        server.checker.notification.status = server.pinger.status;
        server.checker.notification.members = server.pinger.members;
        server.save();
    }
}



function webhook(server, config, pinger) {
    if (pinger.status == 'online' && config.for.online || server.pinger.status == 'offline' && config.for.offline) {;
        axios.post(config.url, {
            content: server.config.notifications.webhook.content.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP).replaceAll('[name]', server.name).replaceAll('[motd]', server.pinger.motd.clean)
        }).then((res) => {
            auditlog(server._id, null, false, "send webhook notification");
        }).catch((err) => {
            auditlog(server._id, null, true, "failed to send webhook notification");
            //not going to logger this as its probbably just incorrect url
        });
    }
}

function email(server, config, pinger) {
    if (pinger.status == 'online' && config.for.online || server.pinger.status == 'offline' && config.for.offline) {
        for (const email of config.emails) {
            const subject = server.config.notifications.email.subject.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP).replaceAll('[name]', server.name).replaceAll('[motd]', server.pinger.motd.clean);
            const body = server.config.notifications.email.content.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP).replaceAll('[name]', server.name).replaceAll('[motd]', server.pinger.motd.clean);
            sendEmail(server._id, null, email, subject, body);
        }
    }
}
const axios = require('axios')
const nodemailer = require("nodemailer");
// create reusable transporter object using the default SMTP transport
let email = nodemailer.createTransport({
    host:process.env.email_host,
    port: parseFloat(process.env.email_port),
    secure: parseFloat(process.env.email_port) == 465 ? true : false,
    auth: {
        user: process.env.email_user, 
        pass: process.env.email_pass,
    },
});
module.exports = async (client, status, server) => {
    if (server.config.notifications && server.config.notifications.enabled) {
        if (server.config.notifications.webhook.enabled) {
            axios.post(server.config.notifications.webhook.url, { content: server.config.notifications.webhook.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP) })
        }
        if (server.config.notifications.bot.enabled) {
            const channel = await client.guilds.cache.get(server._id).channels.cache.get(server.config.notifications.bot.channel);
            if (channel !== undefined) {
                channel.send(server.config.notifications.bot.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP))
            }
        }
        if (server.config.notifications.email.enabled) {
             await email.sendMail({
                from: '"'+ process.env.email +'" <'+process.env.email+'>', // sender address
                to: server.config.notifications.email.to +", " +server.config.notifications.email.to, // list of receivers
                subject: strip_tags(server.config.notifications.email.subject.replaceAll('[status]', status).replaceAll('[ip]', server.IP)), // Subject line
                text: strip_tags(server.config.notifications.email.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP)), // plain text body
                html: strip_tags(server.config.notifications.email.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP)), // html body
            });
        }

    }
}

function strip_tags(html, ...args) {
    return html.replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
        return args.includes(tag) ? '<' + endMark + tag + '>' : '';
    }).replace(/<!--.*?-->/g, '');
}
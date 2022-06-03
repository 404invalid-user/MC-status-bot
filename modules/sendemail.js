const nodemailer = require('nodemailer')
const logger = require('./nodeLogger')
const auditlog = require('./auditlog')
const { emailBanList } = require('../emailbanlist.json')

const { RateLimiter } = require('discord.js-rate-limiter')
const emailRateLimiter = new RateLimiter(5, 60000) // Rate limit to 5 email to that email every hour i think;

// create reusable transporter object using the default SMTP transport
let emailClient = nodemailer.createTransport({
  host: process.env.EMAIL_host,
  port: parseFloat(process.env.EMAIL_port),
  secure: parseFloat(process.env.EMAIL_port) == 465 ? true : false,
  auth: {
    user: process.env.EMAIL_user,
    pass: process.env.EMAIL_pass
  }
})

module.exports = async (guild, user, to, subject, body) => {
  const footer =
    'this was an automated email sent from https://www.mcstatusbot.site to notify you of your minecraft server status if you do not want to receive these email please reply and ask (only me and the email owner can see replys)'
  const limited = emailRateLimiter.take(to)
  if (emailBanList.includes(to)) {
    return auditlog(guild, null, true, 'failed becuase not allowed to send email to: ' + to)
  }
  if (limited) {
    return auditlog(guild, null, true, 'failed because rate limit to send email to: ' + to)
  }
  await emailClient
    .sendMail({
      from: `"${process.env.EMAIL_name || 'MCStatusBot'}" <${process.env.email}>`, // sender address
      //  to: email + ', ' + email, // list of receivers
      to: to, // list of receivers
      subject: strip_tags(subject) || 'MCStatusBot', // Subject line
      text: strip_tags(body) + '\n\n-----\n' + strip_tags(footer), // plain text body
      html: strip_tags(body) + '<br><br>-----<br>' + footer // html body
    })
    .then((send) => {
      auditlog(guild, user, false, 'sent email to: ' + to)
    })
    .catch((er) => {
      auditlog(guild, user, true, 'failed because unknown reason to send email to: ' + to)
      logger.error(er.stack || er)
    })
  return
}

function strip_tags(html, ...args) {
  return html
    .replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
      return args.includes(tag) ? '<' + endMark + tag + '>' : ''
    })
    .replace(/<!--.*?-->/g, '')
}

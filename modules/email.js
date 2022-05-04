require('dotenv').config()
const nodemailer = require('nodemailer')
const actionLog = require('./actionlog')

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

module.exports.notification = async (server) => {
  console.log('email')
  let beenError = false
  let errorReasons = 'naa'
  let redactedErrorReasons = 'naa'
  let actions = 'naa'

  function addError(text) {
    beenError = true
    if (errorReasons == '') {
      errorReasons += text
    } else {
      errorReasons += ', ' + text
    }
  }

  function addRedactedError(text) {
    beenError = true
    if (redactedErrorReasons == '') {
      redactedErrorReasons += text
    } else {
      redactedErrorReasons += '\n\n' + text
    }
  }

  function addAction(text) {
    if (config.debug) console.log('post /api/server added action')
    if (actions == '') {
      actions += text
    } else {
      actions += ', ' + text
    }
  }

  for (const email of server.config.notifications.email.emails) {
    console.log('loop email: ' + email)
    const limited = emailRateLimiter.take(email)
    if (limited) {
      addError('ratelimited wont send email to: ' + email)
      console.log('rate limeot for ' + email)
    } // No response is sent if the user is rate limited
    await emailClient
      .sendMail({
        from: `"${process.env.EMAIL_name || 'MCstatus'}" <${process.env.email}>`, // sender address
        //  to: email + ', ' + email, // list of receivers
        to: email, // list of receivers
        subject: strip_tags(server.config.notifications.email.subject.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP)), // Subject line
        text:
          strip_tags(server.config.notifications.email.content.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP)) +
          '\n\n-----\nthis was an automated email sent from https://www.mcstatusbot.site to notify you of your minecraft server status if you do not want to receive these email please reply (only me the bot maintainer can see replys)', // plain text body
        html:
          strip_tags(server.config.notifications.email.content.replaceAll('[status]', server.pinger.status).replaceAll('[ip]', server.IP)) +
          '<br><br>-----<br>this was an automated email sent from https://www.mcstatusbot.site to notify you of your minecraft server status if you do not want to receive these email please reply (only me the bot maintainer can see theses)' // html body
      })
      .then((e) => {
        addAction('sent email to: ' + email)
        console.log('sent email to' + email)
      })
      .catch((error) => {
        addError('[redacted] error sending email to: ' + email)
        addRedactedError(error.stack.toString() || error.toString())
      })
  }
  if (beenError) {
    actionLog(server, '0', 'notification-email_error', errorReasons, redactedErrorReasons)
  }
  actionLog(server, '0', 'notification-email_action', actions)
}

const strip_tags = (html, ...args) => {
  return html
    .replaceAll(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
      return args.includes(tag) ? '<' + endMark + tag + '>' : ''
    })
    .replaceAll(/<!--.*?-->/g, '')
}

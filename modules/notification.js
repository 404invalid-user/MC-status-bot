const axios = require('axios')
const email = require('./email')
module.exports = async (status, server) => {
  console.log('running nitification')

  if (server.config.notifications) return
  console.log('has notification config')
  if (!server.checker.notification) {
    console.log('missing notifincation checker')
    server.checker.notification = {
      status: server.pinger.status == 'online' ? 'offline' : 'online',
      members: '0'
    }
  }
  console.log('checker:: ' + server.checker.notification.status)
  console.log('pinger: ' + server.pinger.status)
  if (server.checker.notification.status !== server.pinger.status) {
    console.log('values dont match')
    //email
    if (server.config.notifications.email.enabled) {
      console.log('email enabled')
      if (server.pinger.status == 'online' && server.config.notifications.email.for.online) {
        email.notification(server)
      }
      if (server.pinger.status == 'offline' && server.config.notifications.email.for.offline) {
        email.notification(server)
      }
    }
    //webhook
    if (server.config.notifications.webhook.enabled) {
      console.log('webhook enabled')
      if (server.pinger.status == 'online' && server.config.notifications.webhook.for.online) {
        axios.post(server.config.notifications.webhook.url, { content: server.config.notifications.webhook.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP) })
      }
      if (server.pinger.status == 'offline' && !server.config.notifications.webhook.for.offline) {
        axios.post(server.config.notifications.webhook.url, { content: server.config.notifications.webhook.content.replaceAll('[status]', status).replaceAll('[ip]', server.IP) })
      }
    }

    server.checker.notification.status = server.pinger.status
    server.checker.notification.members = server.pinger.members
    server.save()
  }
}

function strip_tags(html, ...args) {
  return html
    .replace(/<(\/?)(\w+)[^>]*\/?>/g, (_, endMark, tag) => {
      return args.includes(tag) ? '<' + endMark + tag + '>' : ''
    })
    .replace(/<!--.*?-->/g, '')
}

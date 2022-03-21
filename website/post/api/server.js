const logger = require('../../../modules/nodeLogger')
const cache = require('../../../modules/cache')
const timezones = require('../../../modules/timezones');
const errorLogger = require('../../../modules/errors');
module.exports = {
  path: '/api/server',
  dynamic: false,
  async run(shards, req, res) {
    try {
      if (req.user == null) {
        return res.status(401).json({ message: '401: incorrect details please login again', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      }
      const server = await cache.lookup('Server', req.body.data._id)
      if (server == null) return res.status(404).json({ message: '404: server not found', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      let canAccessServer = false
      for (const g of req.user.guilds) {
        if (g._id == server._id && g.admin == true) {
          canAccessServer = true
        }
      }
      //let admins access any server
      if (req.user.admin) canAccessServer = true
      if (!canAccessServer) return res.status(403).json({ message: '403: Forbidden you can not access this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })

      if (!timezones.includes(req.body.data.timezone)) {
        let newError = await errorLogger(req.user.id, `400: timezone incorrect`, "saving guild with http api");
        return res.status(400).json({ error: '400: timezone incorrect', errorid: newError, responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
      }
      const newConfig = req.body.data.config;
      server.IP = req.body.data.IP
      server.timezone = req.body.data.timezone

      server.Bedrock = req.body.data.Bedrock ? true : false
      if (req.body.data.Bedrock) {
        server.Bedrock = true;
      } else {
        server.Bedrock = false;
      }
      if (req.body.data.Logging) {
        server.Logging = true;
      } else {
        server.Logging = false;
      }
      server.CategoryId = req.body.data.CategoryId
      server.StatusChannId = req.body.data.StatusChannId
      server.NumberChannId = req.body.data.NumberChannId
      if (req.body.data.MemberChannEnabled) {
        server.MemberChannEnabled = true;
      } else {
        server.MemberChannEnabled = false;
      }

      //hmmm got to love data validation
      if (newConfig) {
        //chart config
        if (newConfig.chart) {
          if (newConfig.chart.enabled) {
            //loop though each chart embed object
            for (const [chartEmbedKey, chartEmbedValue] of Object.entries(newConfig.chart.embed)) {
              //loop though title description and color of embed
              for (const [embedKey, embedValue] of Object.entries(newConfig.chart.embed[chartEmbedKey])) {
                let maxlength = 2000
                if (embedValue == null) {
                  let newError = await errorLogger(req.user.id, `embed.${chartTypeKey}.${embedKey} null`, "saving guild with http api");
                  return res.status(400).json({ error: `embed.${chartTypeKey}.${embedKey} null`, errorid: newError });
                }
                if (checklength(embedValue, maxlength)) {
                  let newError = await errorLogger(req.user.id, `embed.${chartTypeKey}.${embedKey} exeeds max length ${maxlength}`, "saving guild with http api");
                  return res.status(400).json({ error: `embed.${chartTypeKey}.${embedKey} exeeds max length ${maxlength}`, errorid: newError });
                }
              }
              console.log(`${chartEmbedKey}: ${chartEmbedValue}`);
            }
            //loop though each graph text object
            for (const [graphTextKey, graphTextValue] of Object.entries(newConfig.chart.graph.text)) {
              if (!graphTextValue.includes(',') || graphTextValue.split(', ').length !== 3) {
                let newError = await errorLogger(req.user.id, `chart.graph.text.${graphTextKey} is not valid rgb colour`, "saving guild with http api");
                return res.status(400).json({ error: `chart.graph.text.${graphTextKey} is not valid rgb colour`, errorid: newError });
              }
            }
            if (!newConfig.chart.graph.line.fill.includes(',') || newConfig.chart.graph.line.fill.split(', ').length !== 3) {
              let newError = await errorLogger(req.user.id, `chart.graph.line.fill is not valid rgb colour`, "saving guild with http api");
              return res.status(400).json({ error: `chart.graph.line.fill is not valid rgb colour`, errorid: newError });
            }
            if (!newConfig.chart.graph.line.border.includes(',') || newConfig.chart.graph.line.border.split(', ').length !== 3) {
              let newError = await errorLogger(req.user.id, `chart.graph.line.border is not valid rgb colour`, "saving guild with http api");
              return res.status(400).json({ error: `chart.graph.line.border is not valid rgb colour`, errorid: newError });
            }
          }
        }
        //notifications config
        if (newConfig.notifications) {
          if (newConfig.notifications.enabled) {
            //validate webhook
            if (newConfig.notifications.webhook.enabled) {
              //validate webhook url
              if (!newConfig.notifications.webhook.url.includes('.') || !newConfig.notifications.webhook.url.includes('http')) {
                let newError = await errorLogger(req.user.id, `notifications.webhook.url is not a valid url`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.webhook.url is not a valid url`, errorid: newError });
              }
              if (!newConfig.notifications.webhook.url.includes('.') || !newConfig.notifications.webhook.url.includes('http')) {
                let newError = await errorLogger(req.user.id, `notifications.webhook.url is not a valid url`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.webhook.url is not a valid url`, errorid: newError });
              }
              if (checklength(newConfig.notifications.webhook.content)) {
                let newError = await errorLogger(req.user.id, `notifications.webhook.content exeeds max length 2000`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.webhook.content exeeds max length 2000`, errorid: newError });
              }
            }
            //validate bot
            if (newConfig.notifications.bot.enabled) {
              //validate webhook url
              if (!newConfig.notifications.webhook.url.includes('.') || !newConfig.notifications.webhook.url.includes('http')) {
                let newError = await errorLogger(req.user.id, `notifications.webhook.url is not a valid url`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.webhook.url is not a valid url`, errorid: newError });
              }
              if (checklength(newConfig.notifications.bot.channel, 18)) {
                let newError = await errorLogger(req.user.id, `notifications.bot.content is not a channel id`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.bot.channel is not a channel id`, errorid: newError });
              }
              if (checklength(newConfig.notifications.bot.content)) {
                let newError = await errorLogger(req.user.id, `notifications.bot.content exeeds max length 2000`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.bot.content exeeds max length 2000`, errorid: newError });
              }
            }
            //validate email
            if (newConfig.notifications.email.enabled) {
              //validate email to email
              if (!newConfig.notifications.email.to.includes('.') || !newConfig.notifications.email.to.includes('@')) {
                let newError = await errorLogger(req.user.id, `notifications.email.to is not a valid email`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.email.to is not a valid email`, errorid: newError });
              }
              if (checklength(newConfig.notifications.email.subject)) {
                let newError = await errorLogger(req.user.id, `notifications.email.subject exeeds max length 2000`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.email.subject exeeds max length 2000`, errorid: newError });
              }
              if (checklength(newConfig.notifications.email.content)) {
                let newError = await errorLogger(req.user.id, `notifications.email.content exeeds max length 2000`, "saving guild with http api");
                return res.status(400).json({ error: `notifications.email.content exeeds max length 2000`, errorid: newError });
              }
            }
          }
        }
      }

      server.config = newConfig;
      await server.save()
      return res.status(200).json({ message: '200: success', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    } catch (err) {
      logger.error(err.stack || err)
      return res.status(500).json({ message: '500: unknown error please report this', responseTime: (Date.now() - parseFloat(req.date)).toString() + 'ms' })
    }
  }
}


const checklength = (txt, len) => {
  const length = parseFloat(len) ? parseFloat(len) : 2000;
  if (txt.split('').length > length) {
    return true;
  } else {
    return false
  }
}
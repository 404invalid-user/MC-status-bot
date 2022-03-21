const rateLimit = require('express-rate-limit')
const express = require('express')
const fs = require('fs')

const analytics = require('../modules/webanalytics')

module.exports = (webServer, redisclient, shards) => {
  global.redisclient = redisclient
  const cache = require('../modules/cache')
  webServer.use(express.json())
  webServer.use(express.urlencoded({ extended: true }))
  webServer.use(express.static(__dirname + '/dist'))
  webServer.use(analytics())
  webServer.use((req, res, next) => {
    const {
      headers: { cookie }
    } = req
    if (cookie) {
      const values = cookie.split(';').reduce((res, item) => {
        const data = item.trim().split('=')
        return { ...res, [data[0]]: data[1] }
      }, {})
      res.locals.cookie = values
    } else res.locals.cookie = {}
    next()
  })

  webServer.use(async (req, res, next) => {
    const {
      headers: { cookie }
    } = req
    if (cookie) {
      const cookies = cookie.split(';').reduce((res, item) => {
        const data = item.trim().split('=')
        return { ...res, [data[0]]: data[1] }
      }, {})

      if (cookies.id && cookies.token) {
        const currentUser = await cache.lookup('user', cookies.id).catch((e) => {})

        if (currentUser == null) {
          req.user = null
          next()
        } else {
          let hasAccess = false
          for await (const accessCode of currentUser.accessCodes) {
            if (cookies.token == accessCode.code) {
              hasAccess = true
            }
          }
          if (hasAccess) {
            req.user = await currentUser
            next()
          } else {
            req.user = null
            next()
          }
        }
      }
    } else {
      next()
    }
  })
  //rate limit the api so we dont have spam
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 400
  })

  webServer.use('/api/', apiLimiter)
  ;['get', 'post'].forEach((handler) => {
    require(`./handlers/${handler}`)(webServer, shards)
  })
}

const analyticsSchema = require('../database/analytics')
module.exports = (retpath) => {
  async function analytics(req, res, next) {
    next()
    const urlpath = req.originalUrl.split('?')[0]
    if (!retpath) {
      let pagePath = await analyticsSchema.findOne({ _id: urlpath })
      if (pagePath == null) {
        await analyticsSchema.create({ _id: urlpath, views: [] })
        pagePath = await analyticsSchema.findOne({ _id: urlpath })
      }
      pagePath.views.push({
        timestamp: Date.now(),
        ref: req.query.ref || 'none'
      })
      pagePath.save()
    } else if (urlpath.startsWith('^') ? !retpath.replace('^').startsWith(urlpath) : !retpath.includes(urlpath)) {
      let pagePath = await analyticsSchema.findOne({ _id: urlpath })
      if (pagePath == null) {
        analyticsSchema.create({ _id: urlpath, views: {} })
        pagePath = await analyticsSchema.findOne({ _id: urlpath })
      }
      pagePath.views.push({
        timestamp: Date.now(),
        ref: req.query.ref || 'none'
      })
      pagePath.save()
    }
  }
  return analytics
}

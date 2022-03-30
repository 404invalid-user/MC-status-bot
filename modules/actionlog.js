//think of this as nodelogger 2.0 allows users to get and action log of errors and updates and allowa admins to lookup and see errors by going to /admin/errors
const snowflake = require('./snowflake')
const LOG = require('../database/actionlog')

module.exports = async (guildid, userid, type, description, redactedErrorReasons) => {
  const id = await snowflake()
  const user = userid ? userid : '0000'
  const guild = guildid ? guildid : '0000'
  const systemError = redactedErrorReasons ? redactedErrorReasons : 'none'
  LOG.create({
    _id: id,
    date: Date.now().toString(),
    user: user,
    guild: guild,
    type: type,
    description: description,
    systemerror: systemError
  })
  return id
}

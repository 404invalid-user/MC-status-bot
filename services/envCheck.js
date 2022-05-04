let can = {
  email: true
}
const logger = require('../modules/nodeLogger')
module.exports = () => {
  if (!process.env.email || !process.env.EMAIL_host || !process.env.EMAIL_port || !process.env.EMAIL_user || !process.env.EMAIL_pass) {
    can.email = false
    logger.warn('email notifications have been turned off because one or more required email env info is missing')
  }
}

module.exports.can = can

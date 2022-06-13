const shortid = require('shortid');
const LOG = require('../database/auditlogSchema.js');

module.exports = async(guild, user, error, action) => {
    const id = shortid.generate() + shortid.generate();
    LOG.create({
        _id: id,
        user: user,
        guild: guild,
        error: error,
        action: action
    });
    return id;
}
//allows users to see things that have happened in/to them/their server.
const snowflake = require('./snowflake');
const LOG = require('../database/auditlogSchema.js');
const shortid = require('shortid');


module.exports = async(guild, user, error, action) => {
    const id = shortid.generate() + shortid.generate();
    LOG.create({
        _id: id,
        user: user,
        guild: guild,
        error: error,
        action: action
    })
    return id
}
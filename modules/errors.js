//think of this as nodelogger 2.0 allows admins to lookup and see errors by going to /admin/errors
const ERROR = require('../database/error.js');
const snowflake = require('./snowflake');

//error(<user id>, <error.stack || error from catch>, <short description of what its doing>)

module.exports = async (userid, errorraw, proccessdescription) => {
const id = await snowflake()
    ERROR.create({
        _id: id,
        user:userid,
        error: errorraw,
        description: proccessdescription,
        solved: false
    })
    return id;
}
const path = require('path');
module.exports = {
    path: '/bug',
    dynamic: false,
    run(shards, req,res) {
        return res.sendFile(path.join(__dirname, '/../../www/bug.html'));
    }
}
const path = require('path');
module.exports = {
    path: '/chart',
    dynamic: false,
    run(shards, req,res) {
        res.state(200).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>chart uptime</title>
            <style>
                body,html {
                    background-color: black;
                }
            </style>
        </head>
        <body>
            <img src="/chart/uptime.png?id=${req.query.id}" />
        </body>
        </html>
        `)
    }
}

//TODO: make generate chart then redirect to /chart/YYYY/MM/DD/HH/name.png 


